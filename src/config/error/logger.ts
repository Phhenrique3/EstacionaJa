import winston from "winston";
import path from "node:path";
import { error } from "node:console";

const LogDirecory = path.relative(process.cwd(), "Log");

export const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports:[
    new winston.transports.Console(),

    new winston.transports.File({
        filename: path.join(LogDirecory, "error.log"),
        level: "error",
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5
    }),

    new winston.transports.File({
        filename: path.join(LogDirecory, "combined.log"),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
    })
  ]
});
