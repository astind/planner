import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const dateQuerySchema = z.object({
  date: z.iso.date(),
});
