import { env } from "@peerprep/env";
import { questions } from "@peerprep/schemas/validators";
import {
  ExpectedError,
  elysiaAuthPlugin,
  elysiaCorsPlugin,
  elysiaFormatResponsePlugin,
} from "@peerprep/utils/server";
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
  .onBeforeHandle(({ user }) => {
    if (!user?.isAdmin)
      throw new ExpectedError("Only admins can perform this action", StatusCodes.UNAUTHORIZED);
  })
  .post("/", ({ body: questions }) => createQuestions(questions), {
    body: t.Array(questions.createSchema),
  })
  .patch("/:id", ({ params, body: question }) => updateQuestion(params.id, question), {
    body: questions.updateSchema,
  })
  .delete("/:id", ({ params }) => deleteQuestion(params.id));

const publicRoutes = new Elysia()
  .get("/", () => getAllQuestions())
  .get("/:id", ({ params }) => getQuestion(params.id));

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .use(adminOnlyRoutes)
  .use(publicRoutes)
  .listen(env.VITE_QUESTION_SERVICE_PORT);

console.log(`Question service is running at ${app.server?.hostname}:${app.server?.port}`);
