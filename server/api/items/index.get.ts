import { db } from "../../utils/db";
import { dateQuerySchema } from "#shared/schemas/api-param";

export default defineEventHandler(
  async (event): Promise<ApiResponse<Item[]>> => {
    const { user } = await requireUserSession(event);
    const { date } = await getValidatedQuery(event, dateQuerySchema.parse);
    let today;
    if (date) {
      today = new Date(date + "T00:00:00");
    } else {
      today = new Date();
    }
    //const nextWeek = new Date();
    //nextWeek.setDate(nextWeek.getDate() + 7);
    try {
      const items = await db.query.calendarItems.findMany({
        where: {
          ownerId: user.id,
          day: today.toISOString().split("T")[0],
          //{
          //gte: today.toISOString().split("T")[0],
          //lte: nextWeek.toISOString().split("T")[0],
          //},
        },
        columns: {
          ownerId: false,
        },
        orderBy: {
          complete: "asc",
          sortOrder: "asc",
        },
      });
      return { data: items, success: true };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Database error",
      });
    }
  },
);
