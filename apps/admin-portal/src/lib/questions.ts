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

const dummyData: Question[] = [
  {
    id: "dummy1",
    title: "Dummy Question 1",
    content: "Hello _World_",
    difficulty: "EASY",
    tags: ["tag1", "tag2"],
    leetCodeLink: "https://leetcode.com",
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "dummy2",
    title: "Dummy Question 2",
    content: "Hello **World**",
    difficulty: "MEDIUM",
    tags: ["tag3", "tag4"],
    leetCodeLink: "https://leetcode.com",
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

export function useQuestions(): SWRHookResult<Question[]> {
  const { data } = useSWR(SWR_KEY_QUESTIONS, questionsFetcher);
  return data === undefined
    ? { data: undefined, isLoading: true }
    : { data: [...dummyData, ...data], isLoading: false };
}
