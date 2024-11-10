import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../../types";

import client from "@workspace/db/client";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  try {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const element = await client.element.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        height: parsedData.data.height,
        width: parsedData.data.width,
        static: parsedData.data.static,
      },
    });
    res.json({ id: element.id, message: "Element created successfully" });
    return;
  } catch (error) {
    res.status(404).json({ message: "Failed to create element" });
    return;
  }
});
adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  try {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    await client.element.update({
      where: {
        id: req.params.elementId,
      },
      data: {
        imageUrl: parsedData.data.imageUrl,
      },
    });
    res.json({ message: "Element updated successfully" });
    return;
  } catch (error) {
    res.status(404).json({ message: "Failed to update element" });
    return;
  }
});
adminRouter.post("/avatar", adminMiddleware, async (req, res) => {
  try {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const avatar = await client.avatar.create({
      data: {
        name: parsedData.data.name,
        imageUrl: parsedData.data.imageUrl,
      },
    });
    res.json({
      id: avatar.id,
      message: "Avatar created successfully",
    });
    return;
  } catch (error) {
    res.status(404).json({ message: "Cannot create avatar" });
    return;
  }
});
adminRouter.post("/map", adminMiddleware, async (req, res) => {
  try {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const map = await client.map.create({
      data: {
        thumbnail: parsedData.data.thumbnail,
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[1]),
        height: parseInt(parsedData.data.dimensions.split("x")[0]),
        mapElements: {
          create: parsedData.data.defaultElements.map((element) => ({
            elementId: element.elementId,
            x: element.x,
            y: element.y,
          })),
        },
      },
    });
    res.json({
      id: map.id,
      message: "Map created successfully",
    });
    return;
  } catch (error) {
    res.status(404).json({ message: "Failed to create map" });
    return;
  }
});
