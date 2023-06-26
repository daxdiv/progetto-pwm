import express, { type Request, Response } from "express";
import User from "../models/user";
import StatusCodes from "http-status-codes";

import { isValidObjectId } from "mongoose";

const router = express.Router();

router.delete("/:id", async (req: Request, res: Response) => {
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

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, preferredGenres, description } = req.body;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non fornito" }); //COMMENT: 400
    return;
  }
  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID utente non valido" }); //COMMENT: 400
    return;
  }

  if (!username && !email && !password && !preferredGenres && !description) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Nessun campo da modificare" }); //COMMENT: 400
    return;
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username, email, password, preferredGenres, description },
      { new: true }
    );

    if (!updatedUser) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" }); //COMMENT: 404
      return;
    }

    res.status(StatusCodes.OK).json(updatedUser); //COMMENT: 200
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Errore interno, riprovare più tardi" }); //COMMENT: 500
  }
});

export default router;
