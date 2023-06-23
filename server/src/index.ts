import express, { type Express, Response, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app: Express = express();
const port = 3001;
const url = "https://accounts.spotify.com/api/token";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.json());
app.use(cors());

app.get("/auth/access-token", (_req: Request, res: Response) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    res.status(500).send("CLIENT_ID o CLIENT_SECRET mancanti");
    return;
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })
    .then(response => response.json())
    .then(data => {
      res.status(200).send(data);
    });
});

app.listen(port, () => {
  console.log(`⚡️ Server attivo sulla porta ${port}`);
});
