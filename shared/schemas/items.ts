import { z } from "zod";

export const createItemSchema = z.object({
  text: z
    .string()
    .min(3, "Text must be at least 3 Characters")
    .max(100, "Text must be less than 100 Characters"),
  day: z.iso.date(),
  sortOrder: z.number(),
  complete: z.boolean().optional(),
});

export type CreateItem = z.infer<typeof createItemSchema>;
