import express, { type Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Playlist from "../models/playlist";
import { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }

  try {
    const playlists = await Playlist.find({
      userId: { $ne: new ObjectId(userId) },
      isPublic: true,
    }).sort({
      createdAt: -1,
    });

    if (!playlists) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Nessuna playlist trovata" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(
      playlists.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description,
        tags: p.tags,
        tracksCount: p.tracks.length,
        genres: p.genres,
        createdAt: p.createdAt,
      }))
    ); //COMMENT: 200
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { userId, title, description, tags, tracks, genres, isPublic } = req.body;

  if (!userId || !title || !description || !tags || !tracks || !genres) {
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
      isPublic,
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

router.get("/:id/:userId", async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non fornito" }); //COMMENT: 400
    return;
  }
  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non valido" }); //COMMENT: 400
    return;
  }
  if (!isValidObjectId(userId)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Playlist non trovata" }); //COMMENT: 404
      return;
    }

    if (playlist.userId.toString() !== userId) {
      res.status(StatusCodes.FORBIDDEN).json({ message: "Non autorizzato" }); //COMMENT: 403
      return;
    }

    res.status(StatusCodes.OK).json({
      title: playlist.title,
      description: playlist.description,
      tags: playlist.tags,
      tracks: playlist.tracks,
      isPublic: playlist.isPublic,
    }); //COMMENT: 200
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

router.put("/:id/:userId", async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const { title, description, tags, tracks, genres, isPublic } = req.body;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non fornito" }); //COMMENT: 400
    return;
  }
  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }

  if (!title && !description && !tags && !tracks && !genres && !isPublic) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Nessun campo da modificare" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non valido" }); //COMMENT: 400
    return;
  }
  if (!isValidObjectId(userId)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        title,
        description,
        tags,
        tracks,
        genres,
        isPublic,
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Playlist non trovata" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(updatedPlaylist); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

export default router;
