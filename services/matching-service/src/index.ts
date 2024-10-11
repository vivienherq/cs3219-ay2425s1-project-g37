import { db } from "@peerprep/db";
import { env } from "@peerprep/env";
import type { Difficulty } from "@peerprep/schemas";
import { questions } from "@peerprep/schemas/validators";
import {
  ExpectedError,
  elysiaAuthPlugin,
  elysiaCorsPlugin,
  elysiaFormatResponsePlugin,
} from "@peerprep/utils/server";
import { Elysia, t } from "elysia";
import { StatusCodes } from "http-status-codes";

import type { WorkerResponse } from "./worker";

async function getQuestionsFromFilter(difficulty: Difficulty, tags: string[]) {
  const questions = await db.question.findMany({
    where: { difficulty, tags: tags.length > 0 ? { hasSome: tags } : undefined },
  });
  return questions;
}

const worker = new Worker("src/worker.ts");
worker.addEventListener("message", ({ data }: { data: WorkerResponse }) => {
  switch (data.type) {
    case "success": {
      sendMessage(data.matched[0], { type: "success" });
      sendMessage(data.matched[1], { type: "success" });
      break;
    }
    case "timeout": {
      sendMessage(data.userId, { type: "timeout" });
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
    body: t.Object({
      difficulty: questions.difficultySchema,
      tags: t.Array(t.String({ minLength: 1 })),
    }),
    open(ws) {
      if (!ws.data.user) throw new ExpectedError("You must be logged in", StatusCodes.UNAUTHORIZED);
      ws.subscribe(ws.data.user.id);
    },
    async message(ws, { difficulty, tags }) {
      if (!ws.data.user) throw new ExpectedError("You must be logged in", StatusCodes.UNAUTHORIZED);
      const questions = await getQuestionsFromFilter(difficulty, tags);
      worker.postMessage({
        type: "add",
        userId: ws.data.user.id,
        questionIds: questions.map(q => q.id),
      });
      sendMessage(ws.data.user.id, { type: "acknowledgement" });
    },
    close(ws) {
      if (!ws.data.user) throw new ExpectedError("You must be logged in", StatusCodes.UNAUTHORIZED);
      ws.unsubscribe(ws.data.user.id);
      worker.postMessage({ type: "remove", userId: ws.data.user.id });
    },
  })
  .listen(env.VITE_MATCHING_SERVICE_PORT);

function sendMessage(
  userId: string,
  message: { type: "success" } | { type: "acknowledgement" } | { type: "timeout" },
) {
  app.server?.publish(userId, JSON.stringify(message));
}

console.log(`Matching service is running at ${app.server?.hostname}:${app.server?.port}`);
