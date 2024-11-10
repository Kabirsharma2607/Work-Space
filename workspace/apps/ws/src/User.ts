import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@workspace/db/client";
import jwt from "jsonwebtoken";

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class User {
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  constructor(private ws: WebSocket) {
    this.id = generateRandomString(10);
    this.y = 0;
    this.x = 0;
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          const token = parsedData.payload.token;
          const space = await client.space.findFirst({
            where: {
              id: parsedData.payload.spaceId,
            },
          });
          if (!space) {
            this.ws.close();
            return;
          }
          this.spaceId = space.id;
          (this.x = Math.floor(Math.random() * space.height)),
            (this.y = Math.floor(Math.random() * space.width)),
            RoomManager.getInstance().addUser(this.spaceId, this);
          this.send({
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
              users:
                RoomManager.getInstance()
                  .rooms.get(this.spaceId)
                  ?.map((u) => ({ id: u.id })) ?? [],
            },
          });
          RoomManager.getInstance().broadcast({
            type: "user-joined",
            payload: {
              userId: this.id,
              x: this.x,
              y: this.y,
            },
          });
        case "move":
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);
          if (
            (xDisplacement == 0 && yDisplacement == 1) ||
            (xDisplacement == 0 && yDisplacement == 1)
          ) {
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcast(
              {
                type: "move",
                payload: {
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
          }
          this.send({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });
      }
    });
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
