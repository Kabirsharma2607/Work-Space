import { Router } from "express";
import { SignInSchema, SignUpSchema, UpdateMetadataSchema } from "../../types";
import client from "@workspace/db/client";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { hash, compare } from "../../scrypt";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const parsedData = SignUpSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  const hashedPassword = await hash(parsedData.data.password);
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.role === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(400).json({ message: "User already exists" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({ message: "Invalid Inputs" });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token });
    return;
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error" });
    return;
  }
});

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  try {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const response = await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });
    res.json({
      message: "Metadata updated successfully",
    });
    return;
  } catch (error) {
    res.status(400).json({ message: "Error updating metadata" });
    return;
  }
});

userRouter.get("/metadata/bulk", userMiddleware, async (req, res) => {
  try {
    const userIdsString = (req.query.ids ?? "[]") as string;
    const userIds = userIdsString.slice(1, userIdsString.length - 1).split(",");
    const metadata = await client.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        avatar: true,
        id: true,
      },
    });
    res.json({
      avatars: metadata.map((m) => ({
        userId: m.id,
        avatarId: m.avatar?.imageUrl,
      })),
    });
    return;
  } catch (error) {
    res.status(404).json({ message: "Error fetching metadata" });
    return;
  }
});
