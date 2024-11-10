import { NextFunction, Request, Response } from "express";
import client from "@workspace/db/client";
export const spaceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      select: {
        creatorId: true,
      },
    });
    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }
    if (space.creatorId !== req.userId) {
      res.status(404).json({ message: "Unauthorized" });
      return;
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Error fetching space | Internal Error" });
    return;
  }
};
