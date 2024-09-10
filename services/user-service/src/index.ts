import { ExpectedError, elysiaHandleErrorPlugin } from "@peerprep/utils";
import { Elysia } from "elysia";

import { authRoutes } from "~/routes/auth";
import { userRoutes } from "~/routes/users";

const app = new Elysia()
  .use(elysiaHandleErrorPlugin)
  .use(userRoutes)
  .use(authRoutes)
  .get("/foo", () => {
    throw new ExpectedError("This is an expected error", 400);
  })
  .listen(process.env.PORT || 3002);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
