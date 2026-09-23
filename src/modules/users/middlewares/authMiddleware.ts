import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return secret;
}

const JWT_SECRET = getJwtSecret();
export interface AuthRequest extends Request {
  UserId?: string;
}

export default function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "token ausente" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "token mal formatado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub?: string;
    };

    if (typeof payload.sub !== "string") {
      return res.status(401).json({ message: "token inválido" });
    }

    req.UserId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: "token inválido" });
  }
}
