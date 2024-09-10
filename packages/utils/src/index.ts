// Error intentionally thrown in the code, indicating a user fault, not a code bug
// To display a user-friendly error message to the user, compared to a generic "something went wrong"
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
