import { users } from "@peerprep/schemas/validators";
import { elysiaAuthPlugin } from "@peerprep/utils/server";
import { Elysia, t } from "elysia";
import { StatusCodes } from "http-status-codes";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
} from "~/controllers/users";
import { getJwt } from "~/lib/get-jwt";

const adminRoutes = new Elysia()
  .use(elysiaAuthPlugin)
  .onBeforeHandle(({ user, set }) => {
    if (!user?.isAdmin) {
      set.status = StatusCodes.FORBIDDEN;
      return { message: "Forbidden" };
    }
  })
  .get("/", () => getAllUsers())
  .patch("/:id/privilege", ({ params, body }) => updateUserPrivilege(params.id, body.isAdmin), {
    body: t.Object({ isAdmin: t.Boolean() }),
  });

const protectedRoutes = new Elysia({ prefix: "/:id" })
  .use(elysiaAuthPlugin)
  .onBeforeHandle(({ user, params, set }) => {
    if (user?.id !== params.id && !user?.isAdmin) {
      set.status = StatusCodes.UNAUTHORIZED;
      return { message: "Unauthorized" };
    }
  })
  .get("/", ({ params }) => getUser(params.id))
  .patch("/", ({ params, body }) => updateUser(params.id, body), { body: users.updateSchema })
  .delete("/", ({ params }) => deleteUser(params.id));

const publicRoutes = new Elysia().use(elysiaAuthPlugin).post(
  "/",
  async ({ jwt, body, cookie: { auth_token } }) => {
    const id = await createUser(body);
    auth_token.set(await getJwt(id, jwt.sign));
  },
  { body: users.createSchema },
);

export const userRoutes = new Elysia().use(adminRoutes).use(protectedRoutes).use(publicRoutes);
