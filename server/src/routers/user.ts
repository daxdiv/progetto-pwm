import express, { type Request, Response } from "express";
import User from "../models/user";
import StatusCodes from "http-status-codes";
import Playlist from "../models/playlist";

import { isValidObjectId } from "mongoose";
import { checkIds } from "../middlewares";

const router = express.Router();

router.get("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(user); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.delete("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }
  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }

  try {
    const deletedUser = await User.deleteOne({ _id: id });

    if (deletedUser.deletedCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(deletedUser); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.put("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, preferredGenres, description } = req.body;

  if (!username && !email && !password && !preferredGenres && !description) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Nessun campo da modificare" }); //COMMENT: 400
    return;
  }

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username, email, password, preferredGenres, description },
      { new: true }
    );

    if (!updatedUser) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    await updatedUser.save();

    res.status(StatusCodes.OK).json(updatedUser); //COMMENT: 200
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.get("/:userId/playlists", checkIds, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userPlaylists = await Playlist.find({ userId });

    if (!userPlaylists) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Nessuna playlist trovata per questo utente" }); //COMMENT: 404
      return;
    }

    const user = await User.findOne({
      _id: userId,
    });

    const savedPlaylists = await Playlist.find({
      _id: { $in: user?.savedPlaylists },
    });

    const mappedUserPlaylists = userPlaylists.map(p => ({
      id: p._id,
      title: p.title,
      tags: p.tags,
      tracks: p.tracks.map(t => ({
        name: t.name,
        artists: t.artists,
        duration: t.duration,
      })),
      genres: p.genres,
      createdAt: p.createdAt,
      duration: p.tracks.reduce((acc, curr) => acc + curr.duration, 0),
      isPublic: p.isPublic,
    }));

    if (!savedPlaylists.length) {
      res.status(StatusCodes.OK).json(mappedUserPlaylists); //COMMENT: 200
      return;
    } else {
      const mappedSavedPlaylists = savedPlaylists.map(p => ({
        id: p._id,
        title: p.title,
        tags: p.tags,
        tracks: p.tracks.map(t => ({
          name: t.name,
          artists: t.artists,
          duration: t.duration,
        })),
        genres: p.genres,
        createdAt: p.createdAt,
        duration: p.tracks.reduce((acc, curr) => acc + curr.duration, 0),
        isPublic: p.isPublic,
      }));

      res.status(StatusCodes.OK).json({
        userPlaylists: mappedUserPlaylists,
        savedPlaylists: mappedSavedPlaylists,
      }); //COMMENT: 200
      return;
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

router.post("/save-playlist", async (req: Request, res: Response) => {
  const { userId, playlistId } = req.body;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }
  if (!playlistId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non fornito" }); //COMMENT: 400
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }
  if (!isValidObjectId(playlistId)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID playlist non valido" }); //COMMENT: 400
    return;
  }

  try {
    const isPlaylistSaved = await User.findOne({
      _id: userId,
      savedPlaylists: {
        $in: [playlistId],
      },
    }).count();

    if (isPlaylistSaved > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Hai già salvato questa playlist" }); //COMMENT: 400
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { savedPlaylists: playlistId } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json({ message: "Playlist salvata correttamente" }); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

export default router;
