import type { Question } from "@peerprep/schemas";
import { questionsClient } from "@peerprep/utils/client";
import useSWR, { mutate } from "swr";

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

export function useQuestions() {
  // If the dummy questions are not necessary anymore:
  // return useSWR("questions:/", questionsClient.swrFetcher<Question[]>);

  // Now we do this to add the dummy questions
  return useSWR("questions:/", async key => {
    const data = await questionsClient.swrFetcher<Question[]>(key);
    return [...dummyData, ...data];
  });
}

export async function mutateQuestions() {
  return mutate("questions:/");
}

export function useQuestion(id: string) {
  // If the dummy questions are not necessary anymore:
  // return useSWR(`questions:/${id}`, questionsClient.swrFetcher<Question>);

  // Now we do this to add the dummy questions
  return useSWR(`questions:/${id}`, key => {
    if (key === "questions:/dummy1") return dummyData[0];
    if (key === "questions:/dummy2") return dummyData[1];
    return questionsClient.swrFetcher<Question>(key);
  });
}

export async function mutateQuestion(id: string) {
  return mutate(`questions:/${id}`);
}
