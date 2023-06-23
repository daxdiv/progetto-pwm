import express, { type Request, Response } from "express";
import User from "../models/user";
import StatusCodes from "http-status-codes";

const router = express.Router();

router.get("/all", async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); //COMMENT: 500
  }
});

export default router;
