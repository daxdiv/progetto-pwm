import express, { type Request, Response } from "express";
import User from "../models/user";
import Playlist from "../models/playlist";

import { isValidObjectId } from "mongoose";
import { checkIds } from "../middlewares";
import capitalize from "../utils/capitalize";

const router = express.Router();

/**
 * Ottenimento dati utente
 */
router.get("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Modifica dati utente
 */
router.put("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, preferredGenres, preferredArtists, description } =
    req.body;

  if (
    !username &&
    !email &&
    !password &&
    !preferredGenres &&
    !preferredArtists &&
    !description
  ) {
    res.status(400).json({ message: "Nessun campo da modificare" });
    return;
  }

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username, email, password, preferredGenres, preferredArtists, description },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    await updatedUser.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: `${capitalize(Object.keys(error.keyValue)[0])} già esistente` });
      return;
    }

    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Eliminazione utente
 */
router.delete("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.deleteOne({ _id: id });

    if (deletedUser.deletedCount === 0) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

/**
 * Ottenimento playlist utente, sia quelle create sia quelle salvate
 */
router.get("/:userId/playlists", checkIds, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userPlaylists = await Playlist.find({ userId });

    if (!userPlaylists) {
      res.status(404).json({ message: "Nessuna playlist trovata per questo utente" });
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
      res.status(200).json({ userPlaylists: mappedUserPlaylists });
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

      res.status(200).json({
        userPlaylists: mappedUserPlaylists,
        savedPlaylists: mappedSavedPlaylists,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Salvataggio playlist esterna
 */
router.post("/save-playlist", async (req: Request, res: Response) => {
  const { userId, playlistId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "ID utente non fornito" });
    return;
  }
  if (!playlistId) {
    res.status(400).json({ message: "ID playlist non fornito" });
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(400).json({ message: "ID utente non valido" });
    return;
  }
  if (!isValidObjectId(playlistId)) {
    res.status(400).json({ message: "ID playlist non valido" });
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
      res.status(400).json({ message: "Hai già salvato questa playlist" });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { savedPlaylists: playlistId } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json({ message: "Playlist salvata correttamente" });
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

export default router;
