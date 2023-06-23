import express, { type Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db-connection";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";

dotenv.config();

const app: Express = express();
const port = 3001;

db.on("error", error => console.error(`Errore connessione al database: \n ${error}`));
db.once("open", () => console.log("Connessione al database avvenuta con successo"));

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`⚡️ Server attivo sulla porta ${port}`);
});
