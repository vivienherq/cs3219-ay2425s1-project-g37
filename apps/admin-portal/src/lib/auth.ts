import type { User } from "@peerprep/schemas";
import { userClient } from "@peerprep/utils/client";
import useSWR, { mutate } from "swr";

export function useAuth() {
  return useSWR("user:/auth/verify-token", userClient.swrFetcher<User | null>);
}

export function mutateAuth() {
  return mutate("user:/auth/verify-token");
}
