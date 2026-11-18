import { db } from "../../utils/db";
import { createListSchema } from "#shared/schemas/lists";
import { customLists } from "../../db/schema";

export default defineEventHandler(
  async (event): Promise<ApiResponse<CustomList>> => {
    const { user } = await requireUserSession(event);
    const { name } = await readValidatedBody(event, createListSchema.parse);
    try {
      const list = await db
        .insert(customLists)
        .values({ name: name, createdBy: user.id })
        .returning();
      return { data: list[0]!, success: true };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to create List",
      });
    }
  },
);
