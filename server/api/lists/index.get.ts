import { db } from "../../utils/db";

export default defineEventHandler(
  async (event): Promise<ApiResponse<CustomList[]>> => {
    const { user } = await requireUserSession(event);
    try {
      const lists = await db.query.customLists.findMany({
        where: {
          createdBy: user.id,
        },
        columns: {
          createdBy: false,
        },
        with: {
          items: true,
        },
      });
      return { data: lists, success: true };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Database error",
      });
    }
  },
);
