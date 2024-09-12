import { env } from "@peerprep/env";
import { questions } from "@peerprep/schemas/validators";
import { elysiaAuthPlugin } from "@peerprep/utils";
import { Elysia, t } from "elysia";
import { StatusCodes } from "http-status-codes";

import {
  createQuestions,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "~/controllers/questions";

const adminOnlyRoutes = new Elysia()
  .use(elysiaAuthPlugin)
  .onBeforeHandle(({ user, set }) => {
    if (!user?.isAdmin) {
      set.status = StatusCodes.UNAUTHORIZED;
      return { message: "Unauthorized" };
    }
  })
  .post("/", ({ body: questions }) => createQuestions(questions), {
    body: t.Array(questions.createSchema),
  })
  .put("/:id", ({ params, body: question }) => updateQuestion(params.id, question), {
    body: questions.updateSchema,
  })
  .delete("/:id", ({ params }) => deleteQuestion(params.id));

const publicRoutes = new Elysia()
  .get("/", () => getAllQuestions())
  .get("/:id", ({ params }) => getQuestion(params.id));

const app = new Elysia().use(adminOnlyRoutes).use(publicRoutes).listen(env.QUESTION_SERVICE_PORT);

console.log(`Question service is running at ${app.server?.hostname}:${app.server?.port}`);

export type QuestionsService = typeof app;
