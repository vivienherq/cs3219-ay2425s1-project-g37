import { type Static, t } from "elysia";

export const createSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 128 }),
  content: t.String({ minLength: 1, maxLength: 4096 }),
  difficulty: t.Union([t.Literal("EASY"), t.Literal("MEDIUM"), t.Literal("HARD")]),
  tags: t.Array(t.String()),
  leetCodeLink: t.String(),
});
export type NewQuestion = Static<typeof createSchema>;

export const updateSchema = t.Partial(createSchema);
export type UpdateQuestion = Static<typeof updateSchema>;

export const schema = t.Intersect([
  createSchema,
  t.Object({ id: t.String(), createdAt: t.Optional(t.Date()), updatedAt: t.Optional(t.Date()) }),
]);
export type Question = Static<typeof schema>;
