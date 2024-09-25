import type { Question } from "@peerprep/schemas";
import { questionsClient } from "@peerprep/utils/client";
import useSWR, { mutate } from "swr";

const dummyData: Question[] = [
  {
    id: "dummy1",
    title: "Dummy Question 1 (Two Sum)",
    content: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in **any order**.

### Example:
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    difficulty: "EASY",
    tags: ["arrays", "hashing"],
    leetCodeLink: "https://leetcode.com/problems/two-sum/",
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "dummy2",
    title: "Dummy Question 2 (Longest Substring Without Repeating Characters)",
    content: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Example:
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Constraints:
- 0 <= s.length <= 5 * 10^4
- \`s\` consists of English letters, digits, symbols, and spaces.`,
    difficulty: "MEDIUM",
    tags: ["sliding window", "hashing", "strings"],
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
