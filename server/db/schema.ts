import {
  serial,
  text,
  timestamp,
  integer,
  pgTable,
  boolean,
  date,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
});

export const customLists = pgTable("custom_list", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
});

export const customItems = pgTable("custom_item", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  complete: boolean("complete").default(false).notNull(),
  listId: integer("list_id")
    .references(() => customLists.id)
    .notNull(),
  sortOrder: doublePrecision().notNull(),
});

export const calendarItems = pgTable("calendar_item", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  complete: boolean("complete").default(false).notNull(),
  day: date("day").notNull(),
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),
  sortOrder: doublePrecision().notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
