import "dotenv/config";
import { sendMail } from "./providers/mailProvider";

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log(
  "MAIL_PASS length:",
  process.env.MAIL_PASS?.replace(/\s/g, "").length
);

async function test() {
  await sendMail({
    to: "nunesp665@outlook.com.br",
    subject: "Teste EstacioneJa",
    text: "Se você recebeu este e-mail, o envio está funcionando.",
    html: "<h1>Teste EstacioneJa</h1><p>Envio funcionando.</p>",
  });

  console.log("E-mail enviado com sucesso!");
}

test().catch((error) => {
  console.error("Erro ao enviar e-mail:");
  console.error(error);
});