import express, { type Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import User from "../models/user";
import capitalize from "../utils/capitalize";

dotenv.config();

const router = express.Router();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const url = "https://accounts.spotify.com/api/token";

/**
 * Ottenimento dell'access token per le richieste alle API di Spotify
 */
router.get("/access-token", async (_req: Request, res: Response) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    res.status(500).send("SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET mancanti");
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });
    const data = await response.json();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Errore lato server, riprovare più tardi" });
  }
});

/**
 * Login utente (email e password)
 */
router.post("/sign-in", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Email non valida" });
    return;
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(404).json({ error: "Nessun utente trovato con questa email" });
      return;
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Password errata" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Registrazione utente (username, email, password, generi preferiti, artisti preferiti, descrizione utente)
 */
router.post("/sign-up", async (req: Request, res: Response) => {
  const { username, email, password, preferredGenres, preferredArtists, description } =
    req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Email non valida" });
    return;
  }

  try {
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      preferredGenres,
      preferredArtists,
      description,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: `${capitalize(Object.keys(error.keyValue)[0])} già esistente` });
      return;
    }

    res.status(500).json({ message: error.message });
  }
});

export default router;
