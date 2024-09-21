import type { Question } from "@peerprep/schemas";
import {
  type SWRHookResult,
  type ServiceResponseBodySuccess,
  getKyErrorMessage,
  questionsClient,
} from "@peerprep/utils/client";
import useSWR from "swr";

async function questionsFetcher() {
  try {
    const response = await questionsClient.get<ServiceResponseBodySuccess<Question[]>>("");
    const data = await response.json();
    return data.data;
  } catch (e) {
    throw new Error(getKyErrorMessage(e));
  }
}

export const SWR_KEY_QUESTIONS = "questions";

export function useQuestions(): SWRHookResult<Question[]> {
  const { data } = useSWR(SWR_KEY_QUESTIONS, questionsFetcher);
  return data === undefined ? { data: undefined, isLoading: true } : { data, isLoading: false };
}
