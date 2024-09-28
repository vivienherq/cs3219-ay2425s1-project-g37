import type { Difficulty } from "@peerprep/schemas";

import { cn } from "./cn";

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("px-2 py-0.5 text-sm", className)}>{children}</span>;
}

export function QuestionDifficultyLabel({ difficulty }: { difficulty: Difficulty }) {
  switch (difficulty) {
    case "EASY":
      return <Label className="bg-emerald-900 text-emerald-50">Easy</Label>;
    case "MEDIUM":
      return <Label className="bg-yellow-900 text-yellow-50">Medium</Label>;
    case "HARD":
      return <Label className="bg-red-900 text-red-50">Hard</Label>;
  }
}
