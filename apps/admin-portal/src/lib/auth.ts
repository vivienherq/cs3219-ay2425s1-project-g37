import { env } from "@peerprep/env";
import type { User } from "@peerprep/schemas";
import type { ServiceResponseBody } from "@peerprep/utils";
import useSWR from "swr";

async function userFetcher() {
  const response = await fetch(`http://localhost:${env.VITE_USER_SERVICE_PORT}/auth/verify-token`);
  const data = (await response.json()) as ServiceResponseBody<User | null>;
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export function useUser():
  | { data: User | null; isLoading: false }
  | { data: undefined; isLoading: true } {
  const { data } = useSWR("user", userFetcher);
  return data === undefined ? { data: undefined, isLoading: true } : { data, isLoading: false };
}
