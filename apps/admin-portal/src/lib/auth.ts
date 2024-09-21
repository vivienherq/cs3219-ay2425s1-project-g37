import type { User } from "@peerprep/schemas";
import {
  type ServiceResponseBodySuccess,
  getKyErrorMessage,
  userClient,
} from "@peerprep/utils/client";
import useSWR from "swr";

async function userFetcher() {
  try {
    const response =
      await userClient.get<ServiceResponseBodySuccess<User | null>>("auth/verify-token");
    const data = await response.json();
    return data.data;
  } catch (e) {
    throw new Error(getKyErrorMessage(e));
  }
}

export const SWR_KEY_USER = "user";

export function useUser():
  | { data: User | null; isLoading: false }
  | { data: undefined; isLoading: true } {
  const { data } = useSWR(SWR_KEY_USER, userFetcher);
  return data === undefined ? { data: undefined, isLoading: true } : { data, isLoading: false };
}
