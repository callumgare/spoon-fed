import { z } from "zod";

export const pictureDetailsSchema = z.object({
  recipeId: z.string(),
  recipeHash: z.string(),
  pictureType: z.enum(["photo", "image"]),
  pictureHash: z.string(),
})

export type PictureDetails = z.infer<typeof pictureDetailsSchema>