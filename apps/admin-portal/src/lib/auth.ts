import type { User } from "@peerprep/schemas";
import { type ServiceResponseBody, userClient } from "@peerprep/utils/client";
import useSWR from "swr";

async function userFetcher() {
  const response = await userClient.get<ServiceResponseBody<User | null>>("auth/verify-token");
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export function useUser():
  | { data: User | null; isLoading: false }
  | { data: undefined; isLoading: true } {
  const { data } = useSWR("user", userFetcher);
  return data === undefined ? { data: undefined, isLoading: true } : { data, isLoading: false };
}
