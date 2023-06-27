import express, { type Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Playlist from "../models/playlist";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { userId, title, description, tags, tracks, genres } = req.body;

  if (!userId || !title || !description || !tags || !tracks) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Dati mancanti" }); //COMMENT: 400
    return;
  }

  try {
    const newPlaylist = new Playlist({
      userId,
      title,
      description,
      tags,
      tracks,
      genres,
    });
    await newPlaylist.save();

    res.status(StatusCodes.CREATED).json(newPlaylist); //COMMENT: 201
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

export default router;
