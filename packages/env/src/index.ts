import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// https://env.t3.gg/docs/core
export const env = createEnv({
  server: {
    PEERPREP_FRONTEND_PORT: z.coerce.number(),
    PEERPREP_QUESTION_SPA_PORT: z.coerce.number(),
    USER_SERVICE_PORT: z.coerce.number(),
    QUESTION_SERVICE_PORT: z.coerce.number(),

    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
  },
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: import.meta.env, // Both Vite and Bun use `import.meta.env`
  emptyStringAsUndefined: true,
});
