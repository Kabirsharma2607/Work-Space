import { Router } from "express";
import {
  AddElementSchema,
  CreateElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
import client from "@workspace/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  if (!parsedData.data.mapId) {
    try {
      const response = await client.space.create({
        data: {
          name: parsedData.data.name,
          height: parseInt(parsedData.data.dimensions.split("x")[0]),
          width: parseInt(parsedData.data.dimensions.split("x")[1]),
          creatorId: req.userId!,
        },
      });
      res.json({
        spaceId: response.id,
        message: "Space created successfully",
      });
      return;
    } catch (error) {
      res.status(400).json({
        message: "Failed to create space",
      });
      return;
    }
  }
  try {
    const map = await client.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        mapElements: true,
        height: true,
        width: true,
      },
    });
    if (!map) {
      res.status(400).json({ message: "Invalid map ID" });
      return;
    }
    let space = await client.$transaction(async () => {
      const space = await client.space.create({
        data: {
          name: parsedData.data.name,
          height: map.height,
          width: map.width,
          creatorId: req.userId!,
        },
      });

      await client.spaceElements.createMany({
        data: map.mapElements.map((element) => ({
          spaceId: space.id,
          elementId: element.elementId,
          x: element.x!,
          y: element.y!,
        })),
      });
      return space;
    });
    res.json({
      spaceId: space.id,
      message: "Space created successfully",
    });
    return;
  } catch (error) {
    res.status(400).json({
      message: "Error creating space",
    });
    return;
  }
});
spaceRouter.delete(
  "/element/:spaceId/:elementId",
  userMiddleware,
  async (req, res) => {
    try {
      const parsedData = DeleteElementSchema.safeParse(req.params);
      if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
      }
      const spaceElement = await client.spaceElements.findFirst({
        where: {
          id: req.params.elementId,
        },
        include: {
          space: true,
        },
      });
      if (!spaceElement) {
        res.status(404).json({ message: "Invalid Element ID" });
        return;
      }
      if (
        !spaceElement?.space.creatorId ||
        spaceElement.space.creatorId !== req.userId
      ) {
        res.status(403).send({ message: "Unauthorized" });
        return;
      }
      await client.spaceElements.delete({
        where: {
          id: req.params.elementId,
        },
      });
      res.json({ message: "Element deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to parse data" });
      return;
    }
  }
);
spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
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
      res.status(400).json({ message: "Space not found" });
      return;
    }
    if (space.creatorId !== req.userId) {
      res.status(400).json({ message: "Unauthorized" });
      return;
    }
    await client.space.delete({
      where: {
        id: req.params.spaceId,
      },
    });
    res.status(200).json({ message: "Space deleted successfully." });
    return;
  } catch (error) {
    res.status(400).json({ message: "Failed to delete space." });
    return;
  }
});
spaceRouter.get("/all", userMiddleware, async (req, res) => {
  try {
    const spaces = await client.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });
    res.json({
      spaces: spaces.map((space) => ({
        spaceId: space.id,
        name: space.name,
        dimensions: `${space.height}x${space.width}`,
      })),
    });
    return;
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch spaces." });
    return;
  }
});

spaceRouter.post("/element", userMiddleware, async (req, res) => {
  try {
    const parsedData = AddElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    const space = await client.space.findUnique({
      where: {
        id: req.body.spaceId,
        creatorId: req.userId,
      },
      select: {
        width: true,
        height: true,
      },
    });
    if (!space) {
      res.status(400).json({ message: "Unauthorized" });
      return;
    }
    if (parsedData.data.x > space.height || parsedData.data.y > space.width) {
      res.status(400).json({ message: "Element exceeds space dimensions" });
      return;
    }
    await client.spaceElements.create({
      data: {
        spaceId: req.body.spaceId,
        elementId: parsedData.data.elementId,
        x: parsedData.data.x,
        y: parsedData.data.y,
      },
    });
    res.json({
      message: "Element added successfully",
    });
    return;
  } catch (error) {
    res.status(400).json({ message: "Failed to add element" });
    return;
  }
});

spaceRouter.get("/:spaceId", async (req, res) => {
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });
    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }

    res.json({
      dimensions: `${space.height}x${space.width}`,
      elements: space.elements.map((element) => ({
        id: element.id,
        element: {
          id: element.element.id,
          imageUrl: element.element.imageUrl,
          height: element.element.height,
          width: element.element.width,
          static: element.element.static,
        },
        x: element.x,
        y: element.y,
      })),
    });
    return;
  } catch (error) {
    res.status(400).json({ message: "Failed to parse data" });
    return;
  }
});
