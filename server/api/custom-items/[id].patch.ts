import { db } from "../../utils/db";
import { idParamSchema } from "#shared/schemas/api-param";
import { createCustomItemSchema } from "#shared/schemas/custom-items";
import { customItems } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user } = await requireUserSession(event);
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse);
  const { text, listId, sortOrder, complete } = await readValidatedBody(
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
    const item = await db.query.customItems.findFirst({
      where: {
        id: id,
        listId: listId,
      },
      columns: {
        complete: true,
      },
    });
    if (item && list) {
      await db
        .update(customItems)
        .set({
          text: text,
          listId: listId,
          sortOrder: sortOrder,
          complete: complete,
        })
        .where(eq(customItems.id, id));
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
  });
});
