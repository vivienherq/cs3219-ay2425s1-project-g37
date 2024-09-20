import { env } from "@peerprep/env";
import ky from "ky";

export type { ServiceResponseBody } from "./server";

export const userClient = ky.create({
  prefixUrl: `http://localhost:${env.VITE_USER_SERVICE_PORT}`,
  hooks: {
    beforeError: [
      error => {
        // TODO
        error.message = "";
        return error;
      },
    ],
  },
});

export const questionsClient = ky.create({
  prefixUrl: `http://localhost:${env.VITE_QUESTION_SERVICE_PORT}`,
});
