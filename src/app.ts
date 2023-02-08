import express, { Application, Request, Response } from "express";
const app: Application = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port: number = 3000;

app.get("/", (_req, res: Response) => {
  res.send(`Server is running on port: ${port}`);
});
