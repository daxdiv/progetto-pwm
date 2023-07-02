import type { NextFunction, Request, Response } from "express";

import { isValidObjectId } from "mongoose";

export function checkIds(req: Request, res: Response, next: NextFunction) {
  if (
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    req.method !== "PUT" &&
    req.method !== "POST"
  ) {
    res.status(405).json({ message: "Metodo non consentito" });
    return;
  }

  for (const id of Object.values(req.params)) {
    if (!id) {
      res.status(400).json({ message: "ID non fornito" });
      return;
    }
    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "ID non valido" });
      return;
    }
  }

  next();
}
