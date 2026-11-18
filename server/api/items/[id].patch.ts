import { db } from "../../utils/db";
import { createItemSchema } from "#shared/schemas/items";
import { calendarItems } from "../../db/schema";
import { eq } from "drizzle-orm";
import { idParamSchema } from "#shared/schemas/api-param";
import { ApiResponse } from "~~/shared/types/api-response";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user } = await requireUserSession(event);
  const { text, day, sortOrder, complete } = await readValidatedBody(
    event,
    createItemSchema.parse,
  );
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse);
  try {
    const item = await db.query.calendarItems.findFirst({
      where: {
        id: id,
        ownerId: user.id,
      },
    });
    if (item) {
      await db
        .update(calendarItems)
        .set({ text: text, day: day, sortOrder: sortOrder, complete: complete })
        .where(eq(calendarItems.id, id));
      return { data: null, success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to update item",
    });
  }
  throw createError({
    statusCode: 401,
    message: "Access Denied",
  });
});
