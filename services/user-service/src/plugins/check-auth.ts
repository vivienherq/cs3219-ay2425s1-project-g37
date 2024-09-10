import { jwt } from "@elysiajs/jwt";
import { db } from "@peerprep/db";
import Elysia from "elysia";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is required.");
  process.exit(1);
}

// name is necessary for Elysia to deduplicate the plugin
// https://elysiajs.com/essential/plugin.html#plugin-deduplication
export const checkAuthPlugin = new Elysia({ name: "check-auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET }))
  .derive({ as: "scoped" }, async ({ jwt, cookie: { auth_token } }) => {
    if (!auth_token) return { user: null };

    const result = await jwt.verify(auth_token.value);
    if (!result) return { user: null };

    const id = result.sub;
    if (!id) return { user: null };

    const user = await db.user.findUnique({ where: { id } });
    return { user };
  });
