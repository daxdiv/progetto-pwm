import express, { type Request, Response } from "express";
import Playlist from "../models/playlist";
import { ObjectId } from "mongodb";
import { checkIds } from "../middlewares";

const router = express.Router();

/**
 * Ottenimento playlist pubbliche di un utente (visualizzate nella pagina Sfoglia playlist -> BrowsePlaylists.tsx)
 */
router.get("/:userId", checkIds, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const playlists = await Playlist.find({
      userId: { $ne: new ObjectId(userId) },
      isPublic: true,
    }).sort({
      createdAt: -1,
    });

    if (!playlists) {
      res.status(404).json({ message: "Nessuna playlist trovata" });
      return;
    }

    res.status(200).json(
      playlists.map(p => ({
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
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Ottenimento dati di una playlist, solo se lo userId corrisponde a quello della playlist
 */
router.get("/:id/:userId", checkIds, async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      res.status(404).json({ message: "Playlist non trovata" });
      return;
    }

    if (playlist.userId.toString() !== userId) {
      res.status(403).json({ message: "Non autorizzato" });
      return;
    }

    res.status(200).json({
      title: playlist.title,
      description: playlist.description,
      tags: playlist.tags,
      tracks: playlist.tracks,
      isPublic: playlist.isPublic,
    });
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Creazione playlist
 */
router.post("/", async (req: Request, res: Response) => {
  const { userId, title, description, tags, tracks, genres, isPublic } = req.body;

  if (!userId || !title || !description || !tags || !tracks || !genres) {
    res.status(400).json({ message: "Dati mancanti" });
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

    res.status(201).json(newPlaylist);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Esiste già una tua playlist con questo titolo" });
      return;
    }

    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Modifica playlist, solo se lo userId di chi effettua la modifica corrisponde a quello della playlist
 */
router.put("/:id/:userId", checkIds, async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const { title, description, tags, tracks, genres, isPublic } = req.body;

  if (!title && !description && !tags && !tracks && !genres && !isPublic) {
    res.status(400).json({ message: "Nessun campo da modificare" });
    return;
  }

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      res.status(404).json({ message: "Playlist non trovata" });
      return;
    }

    if (playlist.userId.toString() !== userId) {
      res.status(403).json({ message: "Non autorizzato" });
      return;
    }

    const updatedPlaylist = await Playlist.updateOne(
      { _id: id },
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
      res.status(404).json({ message: "Playlist non trovata" });
      return;
    }

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Esiste già una tua playlist con questo titolo" });
      return;
    }

    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

/**
 * Eliminazione playlist
 */
router.delete("/:id", checkIds, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPlaylist = await Playlist.deleteOne({ _id: id });

    if (deletedPlaylist.deletedCount === 0) {
      res.status(404).json({ message: "Playlist non trovata" });
      return;
    }

    res.status(200).json(deletedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Errore interno, riprovare più tardi" });
  }
});

export default router;
