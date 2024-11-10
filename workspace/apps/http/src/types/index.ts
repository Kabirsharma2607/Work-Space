import z from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  role: z.enum(["user", "admin"]),
});

export const SignInSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string().optional(),
});

export const DeleteElementSchema = z.object({
  elementId: z.string(),
  spaceId: z.string(),
});

export const AddElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string(),
  height: z.number(),
  width: z.number(),
  static: z.boolean(),
});

export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
  imageUrl: z.string(),
  name: z.string(),
});

export const CreateMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
  name: z.string(),
});

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role: "Admin" | "User";
    }
  }
}
