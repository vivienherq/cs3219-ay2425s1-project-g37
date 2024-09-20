import { env } from "@peerprep/env";
import { elysiaCorsPlugin, elysiaFormatResponsePlugin } from "@peerprep/utils";
import { Elysia } from "elysia";

import { authRoutes } from "~/routes/auth";
import { userRoutes } from "~/routes/users";

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .group("/users", app => app.use(userRoutes))
  .group("/auth", app => app.use(authRoutes))
  .listen(env.VITE_USER_SERVICE_PORT);

console.log(`User service is running at ${app.server?.hostname}:${app.server?.port}`);
