import type { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";

export function checkIds(req: Request, res: Response, next: NextFunction) {
  if (
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    req.method !== "PUT" &&
    req.method !== "POST"
  ) {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: "Metodo non consentito" }); //COMMENT: 405
    return;
  }

  for (const id of Object.values(req.params)) {
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "ID non fornito" });
      return;
    }
    if (!isValidObjectId(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "ID non valido" });
      return;
    }
  }

  next();
}
