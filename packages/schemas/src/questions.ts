import { type Static, t } from "elysia";

export const createSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 128 }),
  content: t.String({ minLength: 1, maxLength: 4096 }),
  difficulty: t.Union([t.Literal("easy"), t.Literal("medium"), t.Literal("hard")]),
  tags: t.Array(t.String()),
  leetCodeLink: t.String(),
});

export const schema = t.Intersect([createSchema, t.Object({ id: t.String() })]);

export type Question = Static<typeof schema>;
