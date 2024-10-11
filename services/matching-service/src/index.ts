import { env } from "@peerprep/env";
import {
  elysiaAuthPlugin,
  elysiaCorsPlugin,
  elysiaFormatResponsePlugin,
} from "@peerprep/utils/server";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .use(elysiaAuthPlugin)
  .get("/status", () => new Response("Online"))
  .ws("/", {
    open(ws) {
      ws.send("Welcome!");
    },
    message(ws, message) {
      console.log(ws.id);
      ws.send(`${message} ${ws.data.user?.email ?? "unauthenticated"}`);
    },
  })
  .listen(env.VITE_MATCHING_SERVICE_PORT);

console.log(`Matching service is running at ${app.server?.hostname}:${app.server?.port}`);
