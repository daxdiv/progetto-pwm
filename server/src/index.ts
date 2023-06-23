import express, { type Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 3001;

app.get("/", (_req: Request, res: Response) => {
  res.send("Test");
});

app.listen(port, () => {
  console.log(`⚡️ Server attivo sulla porta ${port}`);
});
