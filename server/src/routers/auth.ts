import express, { type Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import User from "../models/user";
import StatusCode from "http-status-codes";

dotenv.config();

const router = express.Router();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const url = "https://accounts.spotify.com/api/token";

router.get("/access-token", (_req: Request, res: Response) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    res.status(500).send("CLIENT_ID o CLIENT_SECRET mancanti");
    return;
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })
    .then(response => response.json())
    .then(data => {
      res.status(StatusCode.OK).send(data); //COMMENT: 200
    })
    .catch(() => {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: "Errore lato server, riprovare più tardi" }); //COMMENT: 500
    });
});

router.post("/sign-in", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      res
        .status(StatusCode.NOT_FOUND)
        .json({ error: "Nessun utente trovato con queste credenziali" }); //COMMENT: 404
      return;
    }

    res.status(StatusCode.OK).json(user); //COMMENT: 200
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message }); //COMMENT: 500
  }
});

export default router;
