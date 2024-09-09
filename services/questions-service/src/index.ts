import { Elysia } from "elysia";

import { router } from "./router";

const app = new Elysia().use(router).listen(process.env.PORT || 3001);

console.log(`Questions service is up at ${app.server?.hostname}:${app.server?.port}`);
