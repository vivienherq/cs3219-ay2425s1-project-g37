import type { NewQuestion, Question, UpdateQuestion } from "@peerprep/schemas";
import { questionsClient } from "@peerprep/utils/client";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function useQuestions() {
  return useSWR("questions:/", questionsClient.swrFetcher<Question[]>);
}

export async function mutateQuestions() {
  return mutate("questions:/");
}

export function useQuestion(id: string) {
  return useSWR(`questions:/${id}`, questionsClient.swrFetcher<Question>);
}

export async function mutateQuestion(id: string) {
  return mutate(`questions:/${id}`);
}

export function useAddQuestions() {
  return useSWRMutation("questions:/", (_, { arg }: { arg: NewQuestion | NewQuestion[] }) =>
    questionsClient.post("/", { json: arg }),
  );
}

export function useEditQuestion(id: string) {
  return useSWRMutation(
    ["questions:/", `questions:/${id}`],
    (_, { arg }: { arg: UpdateQuestion }) => questionsClient.patch(`/${id}`, { json: arg }),
  );
}

export function useDeleteQuestion(id: string) {
  return useSWRMutation(["questions:/", `questions:/${id}`], () =>
    questionsClient.delete(`/${id}`),
  );
}
