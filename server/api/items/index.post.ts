import { db } from "../../utils/db";
import { createItemSchema } from "#shared/schemas/items";
import { calendarItems } from "../../db/schema";

export default defineEventHandler(async (event): Promise<ApiResponse<Item>> => {
  const { user } = await requireUserSession(event);
  const { text, day, sortOrder } = await readValidatedBody(
    event,
    createItemSchema.parse,
  );
  try {
    const item = await db
      .insert(calendarItems)
      .values({ text: text, ownerId: user.id, day: day, sortOrder: sortOrder })
      .returning();
    return { data: item[0]!, success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create List",
    });
  }
});
