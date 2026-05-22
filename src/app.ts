import express, { Request, Response } from "express";
import cors from "cors";
import { routes } from "./routes";
import handleErrors from "./middlewares/handleErrors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request: Request, response: Response) => {
  return response.json({
    message: "API do estacionamento rodando",
  });
});


app.use(routes)
app.use(handleErrors)
export { app };