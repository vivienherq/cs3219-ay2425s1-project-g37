import { env } from "@peerprep/env";
import type { Difficulty } from "@peerprep/schemas";
import { Button } from "@peerprep/ui/button";
import { cn } from "@peerprep/ui/cn";
import { FormControl } from "@peerprep/ui/form-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@peerprep/ui/select";
import { useAuth, useQuestions, useWsSubscription } from "@peerprep/utils/client";
import { useState } from "react";

function useTags() {
  const { data: questions } = useQuestions();
  if (!questions) return [];
  const tagsSet = new Set<string>();
  questions.forEach(question => question.tags.forEach(tag => tagsSet.add(tag)));
  return Array.from(tagsSet).sort();
}

function useMatchedQuestions(difficulty: Difficulty, tags: string[]) {
  const { data: questions } = useQuestions();
  if (!questions) return [];
  return questions.filter(
    question =>
      question.difficulty === difficulty &&
      (tags.length === 0 || tags.some(tag => question.tags.includes(tag))),
  );
}

function MatchmakingForm({
  onMatchmaking,
}: {
  onMatchmaking: (difficulty: Difficulty, tags: string[]) => void;
}) {
  const { data: user } = useAuth();
  const allTags = useTags();
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const matchedQuestions = useMatchedQuestions(difficulty, selectedTags);

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag],
    );
  };

  if (!user || !allTags.length) return null;

  return (
    <div className="flex w-full flex-row justify-center px-6 py-12">
      <form
        className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12"
        onSubmit={async e => {
          e.preventDefault();
          onMatchmaking(difficulty, selectedTags);
        }}
      >
        <h1 className="text-main-50 text-2xl">Welcome, @{user.username}!</h1>
        <p>
          Select the filtering criteria below and we will match you with a fellow user to
          collaborate on a problem.
        </p>
        <FormControl label="Difficulty">
          <Select value={difficulty} onValueChange={value => setDifficulty(value as Difficulty)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <div className="flex flex-col gap-1.5">
          <FormControl
            label={
              <span className="flex flex-row gap-4">
                Topics
                {selectedTags.length > 0 ? (
                  <button
                    type="button"
                    className="text-main-50 tracking-normal"
                    onClick={() => setSelectedTags([])}
                  >
                    [Clear selection]
                  </button>
                ) : null}
              </span>
            }
          />
          <div className="flex flex-row flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button
                type="button"
                className={cn(
                  "block px-3 py-1 text-sm",
                  selectedTags.includes(tag) ? "bg-main-600 text-main-50" : "bg-main-800",
                )}
                key={tag}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <Button
          variants={{ variant: "primary" }}
          disabled={matchedQuestions.length <= 0}
          type="submit"
        >
          Start matching
        </Button>
        {matchedQuestions.length <= 0 ? (
          <p className="text-red-500">
            No questions match the selected difficulty and tags. Try changing the filters.
          </p>
        ) : null}
      </form>
    </div>
  );
}

export default function IndexPage() {
  const ws = useWsSubscription<
    { difficulty: Difficulty; tags: string[] },
    { type: "success" } | { type: "acknowledgement" } | { type: "timeout" }
  >("matching:/", `ws://localhost:${env.VITE_MATCHING_SERVICE_PORT}`);

  if (!ws.isReady) return null;

  const handleMatchmaking = (difficulty: Difficulty, tags: string[]) => {
    ws.send({ difficulty, tags });
  };

  return (
    <div>
      <div>{ws.data?.type ?? "No responses so far"}</div>
      <MatchmakingForm onMatchmaking={handleMatchmaking} />
    </div>
  );
}
