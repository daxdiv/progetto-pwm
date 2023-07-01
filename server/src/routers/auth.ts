import express, { type Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import User from "../models/user";
import StatusCode from "http-status-codes";
import capitalize from "../utils/capitalize";

dotenv.config();

const router = express.Router();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const url = "https://accounts.spotify.com/api/token";

router.get("/access-token", async (_req: Request, res: Response) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send("CLIENT_ID o CLIENT_SECRET mancanti"); // COMMENT: 500
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

    res.status(StatusCode.OK).send(data); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: "Errore lato server, riprovare più tardi" }); //COMMENT: 500
  }
});

router.post("/sign-in", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    res.status(StatusCode.BAD_REQUEST).json({ message: "Email non valida" }); //COMMENT: 400
    return;
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res
        .status(StatusCode.NOT_FOUND)
        .json({ error: "Nessun utente trovato con questa email" }); //COMMENT: 404
      return;
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "Password errata" }); //COMMENT: 401
      return;
    }

    res.status(StatusCode.OK).json(user); //COMMENT: 200
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message }); //COMMENT: 500
  }
});

router.post("/sign-up", async (req: Request, res: Response) => {
  const { username, email, password, preferredGenres, preferredArtists, description } =
    req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    res.status(StatusCode.BAD_REQUEST).json({ message: "Email non valida" }); //COMMENT: 400
    return;
  }

  try {
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: password.toLowerCase(),
      preferredGenres,
      preferredArtists,
      description,
    });

    await user.save();

    res.status(StatusCode.CREATED).json(user); //COMMENT: 201
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: `${capitalize(Object.keys(error.keyValue)[0])} già esistente` }); //COMMENT: 400
      return;
    }

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message }); //COMMENT: 500
  }
});

export default router;
