import type { Question } from "@peerprep/schemas";
import { questions } from "@peerprep/schemas/validators";
import Elysia, { t } from "elysia";

export const router = new Elysia()
  .post(
    "/",
    async ({ body: questions }) => {
      console.log(questions);
    },
    { body: t.Array(questions.createSchema) },
  )
  .get("/", () => [] as Question[])
  .get("/:id", ({ params }) => {
    console.log(params.id);
  })
  .put(
    "/:id",
    ({ params, body: question }) => {
      console.log(params.id, question);
    },
    { body: questions.schema },
  )
  .delete("/:id", ({ params }) => {
    console.log(params.id);
  });
