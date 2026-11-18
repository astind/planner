import { db } from "../../utils/db";
import { idParamSchema } from "#shared/schemas/api-param";
import { customLists } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user } = await requireUserSession(event);
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse);
  try {
    const list = await db.query.customLists.findFirst({
      where: {
        id: id,
        createdBy: user.id,
      },
    });
    if (list) {
      await db.delete(customLists).where(eq(customLists.id, id));
      return { data: null, success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete list",
    });
  }
  throw createError({
    statusCode: 401,
  });
});
