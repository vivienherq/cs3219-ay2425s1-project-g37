// Error intentionally thrown in the code, indicating a user fault, not a code bug
// To display a user-friendly error message to the user, compared to a generic "something went wrong"
import { jwt } from "@elysiajs/jwt";
import { db } from "@peerprep/db";
import { env } from "@peerprep/env";
import Elysia from "elysia";
import type { StatusCodes } from "http-status-codes";

// We can differentiate errors with `instanceof`
export class ExpectedError extends Error {
  statusCode: StatusCodes;

  constructor(message: string, statusCode?: StatusCodes) {
    super(message);
    this.statusCode = statusCode || 400;
    this.name = "ExpectedError";
  }
}

export const elysiaHandleErrorPlugin = new Elysia({ name: "handle-error" })
  .error({ ExpectedError })
  .onError({ as: "global" }, ({ code, error, set }) => {
    if (code === "ExpectedError") {
      set.status = error.statusCode;
      return { error: error.message };
    }
  });

export const elysiaAuthPlugin = new Elysia({ name: "check-auth" })
  .use(jwt({ name: "jwt", secret: env.JWT_SECRET }))
  .derive({ as: "scoped" }, async ({ jwt, cookie: { auth_token } }) => {
    if (!auth_token) return { user: null };

    const result = await jwt.verify(auth_token.value);
    if (!result) return { user: null };

    const id = result.sub;
    if (!id) return { user: null };

    const user = await db.user.findUnique({ where: { id } });
    return { user };
  });
