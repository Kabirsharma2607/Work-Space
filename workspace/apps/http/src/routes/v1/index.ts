import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import client from "@workspace/db/client";

export const router = Router();

router.get("/elements", async (req, res) => {
  try {
    const elements = await client.element.findMany();
    res.json({
      elements: elements.map((element) => ({
        id: element.id,
        imageUrl: element.imageUrl,
        width: element.width,
        height: element.height,
        static: element.static,
      })),
    });
  } catch (error) {
    res.status(404).json({ message: "Could not find elements" });
    return;
  }
});

router.get("/avatars", async (req, res) => {
  try {
    const avatars = await client.avatar.findMany();
    res.json({
      avatars: avatars.map((avatar) => ({
        id: avatar.id,
        imageUrl: avatar.imageUrl,
        name: avatar.name,
      })),
    });
  } catch (error) {
    res.status(404).json({
      message: "Could not find avatars",
    });
    return;
  }
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
