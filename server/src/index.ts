import express, { type Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db-connection";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import playlistRouter from "./routers/playlist";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-doc.json";

// Caricamento variabili d'ambiente
dotenv.config();

const app: Express = express();
const port = 3001;

db.on("error", error => console.error(`Errore connessione al database: \n ${error}`));
db.once("open", () => console.log("Connessione al database avvenuta con successo"));

app.use(express.json()); // Permette di leggere il body delle richieste
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Documentazione API
app.use(cors()); // Determina chi può accedere alle API

// ROUTERS
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/playlist", playlistRouter);

app.listen(port, () => {
  console.log(`⚡️ Server attivo sulla porta ${port}`);
});
