import { db } from "../../utils/db";
import { createCustomItemSchema } from "#shared/schemas/custom-items";
import { customItems } from "../../db/schema";

export default defineEventHandler(async (event): Promise<ApiResponse<Item>> => {
  const { user } = await requireUserSession(event);
  const { text, listId, sortOrder } = await readValidatedBody(
    event,
    createCustomItemSchema.parse,
  );
  try {
    const list = await db.query.customLists.findFirst({
      where: {
        id: listId,
        createdBy: user.id,
      },
    });
    if (list) {
      const item = await db
        .insert(customItems)
        .values({ text: text, listId: listId, sortOrder: sortOrder })
        .returning();
      return { data: item, success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create List",
    });
  }
  throw createError({
    statusCode: 401,
  });
});
