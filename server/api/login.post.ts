import { db } from "../utils/db";
import { loginBodySchema } from "../../shared/schemas/login";

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(
    event,
    loginBodySchema.parse,
  );
  const user = await validateUser(username, password);
  if (user !== null) {
    await setUserSession(event, { user: user });
  } else {
    throw createError({
      status: 401,
      message: "Invalid User",
    });
  }
});

async function validateUser(
  username: string,
  password: string,
): Promise<User | null> {
  let user;
  try {
    user = await db.query.users.findFirst({
      where: {
        username: username,
      },
    });
  } catch (error) {
    throw createError({
      status: 500,
      message: "Internal Error",
    });
  }
  if (user && (await verifyPassword(user.passwordHash, password))) {
    return { id: user.id, username: user.username };
  } else {
    return null;
  }
}
