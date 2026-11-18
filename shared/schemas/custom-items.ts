import { z } from "zod";

export const createCustomItemSchema = z.object({
  text: z
    .string()
    .min(3, "Text must be at least 3 Characters")
    .max(100, "Text must be less than 100 Characters"),
  listId: z.int().min(0, "List Id cannot be less than 1"),
  sortOrder: z.number(),
  complete: z.boolean().optional(),
});

export type CreateCustomItem = z.infer<typeof createCustomItemSchema>;
