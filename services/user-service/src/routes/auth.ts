import Elysia, { t } from "elysia";

import { handleLogin } from "~/controllers/auth";
import { checkAuthPlugin } from "~/plugins/check-auth";

export const authRoutes = new Elysia()
  .use(checkAuthPlugin)
  .post(
    "/login",
    async ({ jwt, body: { email, password }, cookie: { auth_token } }) => {
      const id = await handleLogin(email, password);
      auth_token.set({
        value: await jwt.sign({ sub: id }),
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 1 month
      });
    },
    { body: t.Object({ email: t.String(), password: t.String() }) },
  )
  .get("/verify-token", ({ user }) => ({ user }));
