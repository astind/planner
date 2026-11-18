import { z } from "zod";

export const loginBodySchema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
});

export type Login = z.infer<typeof loginBodySchema>;
