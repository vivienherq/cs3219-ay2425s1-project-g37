import { env } from "@peerprep/env";
import ky, { HTTPError } from "ky";

import type {
  ServiceResponseBody,
  ServiceResponseBodyError,
  ServiceResponseBodySuccess,
} from "./server";

export {
  HTTPError,
  type ServiceResponseBody,
  type ServiceResponseBodySuccess,
  type ServiceResponseBodyError,
};

export function getKyErrorMessage(e: unknown) {
  return e instanceof HTTPError ? e.message : "Something went wrong. Please try again.";
}

async function formatKyError(error: HTTPError): Promise<HTTPError> {
  const response = error.response;
  if (response) {
    const data = (await response.json()) as ServiceResponseBodyError;
    error.message = data.error;
  } else error.message = "Something went wrong. Please try again.";
  return error;
}

export const userClient = ky.create({
  prefixUrl: `http://localhost:${env.VITE_USER_SERVICE_PORT}`,
  credentials: "include",
  hooks: { beforeError: [formatKyError] },
});

export const questionsClient = ky.create({
  prefixUrl: `http://localhost:${env.VITE_QUESTION_SERVICE_PORT}`,
  credentials: "include",
  hooks: { beforeError: [formatKyError] },
});
