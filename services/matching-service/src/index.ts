import { db } from "@peerprep/db";
import { env } from "@peerprep/env";
import type { Difficulty } from "@peerprep/schemas";
import { questions } from "@peerprep/schemas/validators";
import {
  elysiaAuthPlugin,
  elysiaCorsPlugin,
  elysiaFormatResponsePlugin,
} from "@peerprep/utils/server";
import { Elysia, t } from "elysia";

import { createRoom } from "~/controllers/rooms";
import type { WorkerResponse } from "~/worker";

type ResponseMessage =
  | { type: "success"; matched: [string, string]; questionId: string; roomId: string }
  | { type: "acknowledgement" }
  | { type: "requeue-or-exit" }
  | { type: "error"; message: string };

function getMessage(message: ResponseMessage) {
  return JSON.stringify(message);
}

async function getQuestionsFromFilter(difficulties: Difficulty[], tags: string[]) {
  const questions = await db.question.findMany({
    where: {
      difficulty: difficulties.length > 0 ? { in: difficulties } : undefined,
      tags: tags.length > 0 ? { hasSome: tags } : undefined,
    },
  });
  return questions;
}

const worker = new Worker(
  process.env.NODE_ENV === "production" ? "dist/worker.js" : "src/worker.ts",
);

async function processTimeout(userId: string) {
  sendMessage(userId, { type: "requeue-or-exit" });
}

worker.addEventListener("message", async ({ data }: { data: WorkerResponse }) => {
  switch (data.type) {
    case "requeue-or-exit": {
      await processTimeout(data.userId);
      break;
    }

    case "success": {
      try {
        const roomId = await createRoom({
          userIds: data.matched,
          questionId: data.questionId,
          code: "",
          language: "python",
        });
        sendMessage(data.matched[0], {
          type: "success",
          matched: [data.matched[0], data.matched[1]],
          questionId: data.questionId,
          roomId: roomId,
        });
        sendMessage(data.matched[1], {
          type: "success",
          matched: [data.matched[0], data.matched[1]],
          questionId: data.questionId,
          roomId: roomId,
        });
      } catch (error) {
        console.error("Failed to create room:", error);
      }
      break;
    }
    case "timeout": {
      sendMessage(data.userId, { type: "error", message: "Matching timed out. Please try again." });
      break;
    }
  }
});

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .use(elysiaAuthPlugin)
  .get("/status", () => new Response("Online"))
  .ws("/", {
    body: t.Union([
      t.Object({
        type: t.Literal("match"),
        difficulties: t.Array(questions.difficultySchema),
        tags: t.Array(t.String({ minLength: 1 })),
      }),
      t.Object({
        type: t.Literal("abort"),
      }),
    ]),
    open(ws) {
      if (!ws.data.user) {
        ws.send(getMessage({ type: "error", message: "You must be logged in" }));
        return;
      }
      ws.subscribe(ws.data.user.id);
    },
    async message(ws, data) {
      if (!ws.data.user) return;
      if (data.type === "abort") {
        worker.postMessage({ type: "remove", userId: ws.data.user.id });
        sendMessage(ws.data.user.id, { type: "error", message: "Aborted. Please try again." });
        return;
      }
      const questions = await getQuestionsFromFilter(data.difficulties, data.tags);
      if (questions.length === 0) {
        sendMessage(ws.data.user.id, {
          type: "error",
          message: "No questions matched the criteria.",
        });
        return;
      }
      worker.postMessage({
        type: "add",
        userId: ws.data.user.id,
        questionIds: questions.map(q => q.id),
      });
      sendMessage(ws.data.user.id, { type: "acknowledgement" });
    },
    close(ws) {
      if (!ws.data.user) return;
      ws.unsubscribe(ws.data.user.id);
      worker.postMessage({ type: "remove", userId: ws.data.user.id });
    },
  })
  .listen(env.VITE_MATCHING_SERVICE_PORT);

function sendMessage(userId: string, message: ResponseMessage) {
  app.server?.publish(userId, getMessage(message));
}

console.log(`Matching service is running at ${app.server?.hostname}:${app.server?.port}`);
