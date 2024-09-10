import { type Static, t } from "elysia";

export const createSchema = t.Object({
  username: t.String({ minLength: 1, maxLength: 32 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8, maxLength: 128 }),
  isAdmin: t.Optional(t.Boolean()),
});
export type NewUser = Static<typeof createSchema>;

export const updateSchema = t.Partial(createSchema);
export type UpdateUser = Static<typeof updateSchema>;

export const schema = t.Intersect([
  createSchema,
  t.Object({ id: t.String(), createdAt: t.Optional(t.Date()), updatedAt: t.Optional(t.Date()) }),
]);
export type User = Static<typeof schema>;
