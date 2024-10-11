import { env } from "@peerprep/env";
import { elysiaCorsPlugin, elysiaFormatResponsePlugin } from "@peerprep/utils/server";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .get("/status", () => new Response("Online"))
  .get("/", () => new Response("Hello, world!"))
  .listen(env.VITE_MATCHING_SERVICE_PORT);

console.log(`Matching service is running at ${app.server?.hostname}:${app.server?.port}`);
