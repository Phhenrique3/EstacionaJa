-- Interpreta os horários históricos de entrada no fuso da sessão de migração.
-- No banco verificado, esse fuso é America/Sao_Paulo.
ALTER TABLE "ParkingSession"
  ALTER COLUMN "entrada" TYPE TIMESTAMPTZ(3)
  USING "entrada" AT TIME ZONE current_setting('TimeZone');
