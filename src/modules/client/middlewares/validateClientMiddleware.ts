import { NextFunction, Request, Response } from "express";
import  AppError  from "../../../middlewares/AppError";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return nameRegex.test(name);
}

function isValidTipoDocumento(tipo_documento: string): boolean {
    return tipo_documento === "CPF" || tipo_documento === "CNPJ"
}

function normalizeOnlyNumbers(value: string) : string {
    return value.replace(/\D/g, "")
}

export function validateRegisterClientMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, documento, tipo_documento, telefone  } = req.body;

  if (!name || !email || !documento || !tipo_documento || !telefone) {
    throw new AppError("Nome, email, documento, tipo de documento é telefone  são obrigatórios", 400);
  }

  if (typeof name !== "string") {
    throw new AppError("Nome deve ser um texto", 400);
  }

  const nameTrimmed = name.trim();

  if (nameTrimmed.length < 3) {
    throw new AppError("Nome precisa ter no mínimo 3 caracteres", 400);
  }

  if (!isValidName(nameTrimmed)) {
    throw new AppError("Nome deve conter apenas letras e espaços", 400);
  }

  if (typeof email !== "string") {
    throw new AppError("Email deve ser um texto", 400);
  }

  const emailTrimmed = email.trim().toLowerCase();

  if (!isValidEmail(emailTrimmed)) {
    throw new AppError("Email inválido", 400);
  }

  if (typeof telefone !== "string"){
    throw new AppError("telefone deve ser uma string",400)
  }

  const telefoneNormalized = normalizeOnlyNumbers(telefone)

  if(telefoneNormalized.length <10 || telefoneNormalized.length >11){
    throw new AppError("Telefone deve ter 10 ou 11 dígitos", 400);
  }
   if (typeof tipo_documento !== "string") {
    throw new AppError("Tipo de documento deve ser um texto", 400);
  }

  const tipoDocumentoNormalized = tipo_documento.trim().toUpperCase();

  if (!isValidTipoDocumento(tipoDocumentoNormalized)) {
    throw new AppError("Tipo de documento deve ser CPF ou CNPJ", 400);
  }

  if (typeof documento !== "string") {
    throw new AppError("Documento deve ser um texto", 400);
  }

  const documentoNormalized = normalizeOnlyNumbers(documento);

  if (
    tipoDocumentoNormalized === "CPF" &&
    documentoNormalized.length !== 11
  ) {
    throw new AppError("CPF deve ter 11 dígitos", 400);
  }

  if (
    tipoDocumentoNormalized === "CNPJ" &&
    documentoNormalized.length !== 14
  ) {
    throw new AppError("CNPJ deve ter 14 dígitos", 400);
  }
  req.body = {
   name: nameTrimmed,
    email: emailTrimmed,
    telefone: telefoneNormalized,
    tipo_documento: tipoDocumentoNormalized,
    documento: documentoNormalized,
  };

  return next();
}