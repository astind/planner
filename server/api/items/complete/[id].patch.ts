import { db } from "../../../utils/db";
import { idParamSchema } from "#shared/schemas/api-param";
import { calendarItems } from "../../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user } = await requireUserSession(event);
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse);
  try {
    const item = await db.query.calendarItems.findFirst({
      where: {
        id: id,
        ownerId: user.id,
      },
      columns: {
        complete: true,
      },
    });
    if (item) {
      await db
        .update(calendarItems)
        .set({ complete: !item.complete })
        .where(eq(calendarItems.id, id));
      return { data: null, success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete item",
    });
  }
  throw createError({
    statusCode: 401,
  });
});
