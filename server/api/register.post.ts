import { loginBodySchema } from "#shared/schemas/login";
import { db } from "../utils/db";
import { users } from "../db/schema";

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(
    event,
    loginBodySchema.parse,
  );
  const hashedPw = await hashPassword(password);
  const user = (await registerUser(username, hashedPw))[0];
  if (user) {
    await setUserSession(event, {
      user: { id: user.id, username: user.username },
    });
  } else {
    throw createError({
      status: 500,
      message: "Internal Error",
    });
  }
});

async function registerUser(username: string, password: string) {
  let exception;
  try {
    const oldUser = await db.query.users.findFirst({
      where: {
        username: username,
      },
    });
    if (oldUser) {
      exception = createError({ status: 401, message: "Invalid Username" });
    } else {
      const user = await db
        .insert(users)
        .values({ username: username, passwordHash: password })
        .returning();
      return user;
    }
  } catch (error) {
    exception = createError({ status: 500, message: "Internal Error" });
  }
  throw exception;
}
