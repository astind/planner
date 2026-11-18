import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { relations } from "../db/relations";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, relations });
