import { env } from "@peerprep/env";
import { Elysia } from "elysia";

import { router } from "./router";

const app = new Elysia().use(router).listen(env.QUESTION_SERVICE_PORT);

console.log(`User service is running at ${app.server?.hostname}:${app.server?.port}`);
