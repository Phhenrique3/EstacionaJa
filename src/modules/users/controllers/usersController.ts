
import { NextFunction, Request, Response } from "express";
import { LoginDto } from "../dtos/auth/authDtos";
import { usersService } from "../services/usersService";

class UsersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const user = await usersService.register({
        name,
        email,
        password,
      });

      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDto;

      const result = await usersService.login({
        email,
        password,
      });

      const token = result.token;

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.status(200).json({
        message: "Login realizado com sucesso",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { UsersController };