# Correção de data e hora de Brasília

## O que causava a diferença

Na investigação de 24/11/2026, a sessão do PostgreSQL configurado no projeto usava `America/Sao_Paulo`. A coluna `ParkingSession.entrada` era `timestamp without time zone`, e seu valor padrão `CURRENT_TIMESTAMP` era gravado como hora local. O adaptador do Prisma interpretava esse valor como UTC. Ao formatar a data para Brasília, o backend podia mostrar três horas a menos. A divergência entre entrada e saída também podia afetar a cobrança baseada no tempo de permanência.

## Arquivos alterados

- [Conexão do Prisma](../src/config/prisma.ts) configura as conexões da aplicação para usar UTC.
- [Segunda entrada do Prisma](../src/database/prisma.ts) reutiliza a mesma conexão, inclusive nos fluxos de pagamentos e recuperação de senha.
- [Migração da entrada](../prisma/migrations/20261125023000_corrigir_fuso_entrada/migration.sql) converte `ParkingSession.entrada` para `TIMESTAMPTZ(3)`, interpretando o horário anterior conforme o fuso da sessão que executa a migração.
- Os relatórios de [clientes](../src/modules/reports/client/services/reportsService.ts), [veículos](../src/modules/reports/vehicle/service/reportsVehicleService.ts) e [estacionamentos](../src/modules/reports/parking/service/reportsServiceParking.ts) formatam datas em `pt-BR` com o fuso `America/Sao_Paulo`.
- [Recuperação de senha](../src/modules/PasswordResetToken/services/passwordResetService.ts) calcula a validade do token somando 15 minutos ao instante atual.

## 1. Conferir o banco de destino

Execute os comandos na raiz do backend, com as dependências instaladas e a `DATABASE_URL` apontando para o banco desejado.

```bash
npx prisma validate
npx prisma migrate status
```

No cliente SQL, usando a mesma conexão prevista para a migração, confira o fuso e os tipos das colunas.

```sql
SHOW TIME ZONE;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name = 'ParkingSession'
  AND column_name IN ('entrada', 'saida', 'createdAt', 'updatedAt');
```

No banco investigado, os horários legados de entrada devem ser interpretados em `America/Sao_Paulo`. Confirme que a sessão de migração usa esse fuso para preservar o instante representado pelos valores históricos. A configuração UTC da aplicação fica em `src/config/prisma.ts`. O comando de migração usa a conexão definida em `prisma.config.ts`.

## 2. Conferir as migrações pendentes e aplicar

Faça um backup do banco e teste a sequência de migrações em uma cópia antes de aplicá-la ao destino. O comando `migrate deploy` aplica todas as migrações pendentes. No banco investigado, a migração anterior `20261104005728_ajustar_timezone_entrada` também estava pendente e reduz a precisão de `valor_total` para `DECIMAL(10,2)`. Se ela estiver pendente, confira se há valores que seriam arredondados ou que extrapolariam a precisão do novo tipo.

```sql
SELECT count(*) FILTER (WHERE valor_total <> round(valor_total, 2)) AS valores_arredondados,
       count(*) FILTER (WHERE abs(round(valor_total, 2)) >= 100000000) AS valores_fora_do_limite
FROM "ParkingSession";
```

Depois de revisar o resultado e confirmar o fuso da sessão de migração, execute:

```bash
npx prisma migrate deploy
npx prisma migrate status
```

Reinicie o backend com o código atualizado. Para desenvolvimento local, use `npm run dev`.

## 3. Validar a correção

1. Repita a consulta de tipos e confirme que `entrada` e `saida` aparecem como `timestamp with time zone`.
2. Abra uma sessão de teste pelo fluxo normal e confira a entrada contra o relógio de Brasília. A resposta da criação também inclui o campo `entradaFormatada`.
3. Encerre a sessão de teste e confira os horários e o tempo de permanência. Registre um pagamento de teste e confira o instante retornado em `pago_em`.
4. Gere o relatório de estacionamento e confira se a data e a hora correspondem ao horário de Brasília. Por exemplo, `2026-11-25T02:30:00.000Z` na API corresponde a `24/11/2026 às 23:30` em Brasília.
5. Consulte os horários recentes diretamente no banco, com conversão explícita para Brasília.

```sql
SELECT id,
       entrada AT TIME ZONE 'America/Sao_Paulo' AS entrada_brasilia,
       saida AT TIME ZONE 'America/Sao_Paulo' AS saida_brasilia,
       tempo_total_minutos
FROM "ParkingSession"
ORDER BY entrada DESC
LIMIT 5;
```

## Registros históricos e status

A validação inicial passou em um PostgreSQL temporário, incluindo o histórico de migrações, uma nova gravação e um intervalo de 10 minutos com virada de dia em UTC. A aplicação no banco configurado ficou pendente.

A investigação encontrou quatro sessões históricas cuja saída era anterior à entrada, considerando o fuso de Brasília na interpretação da entrada. Após a migração, consulte `SELECT id, entrada, saida FROM "ParkingSession" WHERE saida < entrada;` e compare os resultados com registros de origem antes de ajustar os horários. A migração converte o tipo de `entrada`. A correção individual de dados históricos exige identificar o horário real de cada registro.
