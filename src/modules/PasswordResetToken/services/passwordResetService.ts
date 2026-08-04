import bcrypt from "bcryptjs";
import AppError from "../../../middlewares/AppError";
import { UserModel } from "../../users/models/userModel";
import { ForgotPasswordDto } from "../dtos/forgotPasswordDto";
import { ResetPasswordDto } from "../dtos/resetPasswordDto";
import { sendMail } from "../../../providers/mailProvider";
import { PasswordResetTokenModel } from "../model/passwordResetTokenModel";
function generateToken(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export const passwordResertService = {
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await UserModel.findByEmail(dto.email);

    if (!user) {
      return {
        message:
          "Se esse e-mail estiver cadastrado, eniaremos um código de recuperação ",
      };
    }
    const token = generateToken();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await PasswordResetTokenModel.create({
      email: dto.email,
      token,
      expiresAt,
    });
    await sendMail({
      to: dto.email,
      subject: "Código de recuperação de senha - EstacioneJa",
      text: `Seu código de recuperação é: ${token}. Ele expira em 15 minutos.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Recuperação de senha</h2>

          <p>Você solicitou a redefinição da sua senha no EstacioneJa.</p>

          <p>Seu código de verificação é:</p>

          <h1 style="
          letter-spacing: 5px;
          background: #fef2f2;
          color: #e53935;
          font-size: 36px;
          font-weight: bold;
         ">${token}</h1>

          <p>Esse código expira em 15 minutos.</p>

          <p>Se você não solicitou isso, ignore este e-mail.</p>
        </div>
      `,
    });

    return {
      message:
        "Se esse e-mail estiver cadastrado, enviaremos um código de recuperação.",
    };
  },

  async resetPassword(dto: ResetPasswordDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new AppError("Código inválido ou expirado", 400);
    }

    const passwordResetToken = await PasswordResetTokenModel.findValidToken(
      email,
      dto.token,
    );

    if (!passwordResetToken) {
      throw new AppError("Código inválido ou expirado", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await UserModel.updatePassword(user.id, hashedPassword);

    await PasswordResetTokenModel.markAsUsed(passwordResetToken.id);

    return {
      message: "Senha redefinida com sucesso",
    };
  },
};
