import { type Static, t } from "elysia";

const baseSchema = t.Object({
  username: t.String({ minLength: 1, maxLength: 32 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8, maxLength: 128 }),
  isAdmin: t.Optional(t.Boolean()),
});

export const createSchema = t.Intersect([
  baseSchema,
  t.Object({ adminSignUpToken: t.Optional(t.String()) }),
]);
export type NewUser = Static<typeof createSchema>;

export const updateSchema = t.Partial(baseSchema);
export type UpdateUser = Static<typeof updateSchema>;

export const schema = t.Intersect([
  baseSchema,
  t.Object({ id: t.String(), createdAt: t.Optional(t.Date()), updatedAt: t.Optional(t.Date()) }),
]);
export type User = Static<typeof schema>;
