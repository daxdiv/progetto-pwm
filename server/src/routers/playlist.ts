import express, { type Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Playlist from "../models/playlist";
import { isValidObjectId } from "mongoose";

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

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non fornito" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non valido" }); //COMMENT: 400
    return;
  }

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Playlist non trovata" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(playlist); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non fornito" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non valido" }); //COMMENT: 400
    return;
  }

  try {
    const deletedPlaylist = await Playlist.deleteOne({ _id: id });

    if (deletedPlaylist.deletedCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Playlist non trovata" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(deletedPlaylist); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

export default router;
