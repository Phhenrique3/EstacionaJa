import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { routes } from "./routes";
import handleErrors from "../src/middlewares/handleErrors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.get("/", (request: Request, response: Response) => {
  return response.json({
    message: "API do estacionamento rodando",
  });
});

app.use(routes);

app.use(handleErrors);

export { app };