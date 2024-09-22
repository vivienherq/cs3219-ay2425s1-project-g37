import { env } from "@peerprep/env";
import ky, { HTTPError } from "ky";
import { parse, stringify } from "superjson";

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

export type SWRHookResult<T> = { data: T; isLoading: false } | { data: undefined; isLoading: true };

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
  headers: { "Content-Type": "application/superjson" },
  parseJson: parse,
  stringifyJson: stringify,
});

export const questionsClient = ky.create({
  prefixUrl: `http://localhost:${env.VITE_QUESTION_SERVICE_PORT}`,
  credentials: "include",
  hooks: { beforeError: [formatKyError] },
  headers: { "Content-Type": "application/superjson" },
  parseJson: parse,
  stringifyJson: stringify,
});
