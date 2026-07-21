import "dotenv/config";
import nodemailer from "nodemailer";

interface SendMailDTO {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const mailUser = process.env.MAIL_USER?.trim();
const mailPass = process.env.MAIL_PASS?.replace(/\s/g, "");

if (!mailUser || !mailPass) {
  throw new Error("MAIL_USER ou MAIL_PASS não configurado no .env");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

export async function sendMail({ to, subject, text, html }: SendMailDTO) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}