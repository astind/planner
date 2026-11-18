import { defineRelations } from "drizzle-orm";
import {
  users,
  customLists,
  customItems,
  calendarItems,
  sessions,
} from "./schema";

export const relations = defineRelations(
  { users, customItems, customLists, calendarItems, sessions },
  (r) => ({
    customItems: {
      list: r.one.customLists({
        from: r.customItems.listId,
        to: r.customLists.id,
      }),
    },
    calendarItems: {
      owner: r.one.users({
        from: r.calendarItems.ownerId,
        to: r.users.id,
      }),
    },
    customLists: {
      creator: r.one.users({
        from: r.customLists.createdBy,
        to: r.users.id,
      }),
      items: r.many.customItems(),
    },
  }),
);
