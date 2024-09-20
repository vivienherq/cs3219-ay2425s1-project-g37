import { env } from "@peerprep/env";
import useSWR from "swr";

async function userFetcher() {
  const response = await fetch(`http://localhost:${env.VITE_USER_SERVICE_PORT}/auth/verify-token`);
  return response.json();
}
export function useUser() {
  const { data } = useSWR("user", userFetcher);
  return data;
}
