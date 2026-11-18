import { db } from "../../utils/db";
import { createListSchema } from "#shared/schemas/lists";
import { customLists } from "../../db/schema";
import { eq } from "drizzle-orm";
import { idParamSchema } from "#shared/schemas/api-param";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user } = await requireUserSession(event);
  const { name } = await readValidatedBody(event, createListSchema.parse);
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse);
  try {
    const list = await db.query.customLists.findFirst({
      where: {
        id: id,
        createdBy: user.id,
      },
    });
    if (list) {
      await db
        .update(customLists)
        .set({ name: name })
        .where(eq(customLists.id, id));
      return { data: null, success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to update list",
    });
  }
  throw createError({
    statusCode: 401,
    message: "Access Denied",
  });
});
