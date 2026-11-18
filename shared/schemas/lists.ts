import { z } from "zod";

export const createListSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 Characters")
    .max(35, "Name must be less than 35 Characters"),
});

export type CreateList = z.infer<typeof createListSchema>;
