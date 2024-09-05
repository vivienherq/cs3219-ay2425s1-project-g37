import type { Message } from "@peerprep/types";
import { Elysia } from "elysia";

const message: Message = "hello";

const app = new Elysia().get("/", () => `${message} world`).listen(process.env.PORT || 3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
