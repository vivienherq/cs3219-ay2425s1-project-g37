import { Button } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";
import { Tags } from "lucide-react";

import { useQuestions } from "~/lib/questions";

export default function QuestionsPage() {
  const { data: questions } = useQuestions();
  if (!questions) return null;
  return (
    <div>
      Questions Page
      <div>
        {questions.map(question => (
          <div
            key={question.id}
            className="bg-main-900 my-4 flex items-center justify-between rounded-lg p-4"
          >
            <div>
              <span className="flex-grow truncate">{question.title}</span>
              <div className="flex items-center">
                <div
                  className={`inline-flex items-center justify-center px-2 py-1 text-sm text-white`}
                >
                  {question.difficulty}
                </div>
                <div className="ml-4 flex items-center">
                  <div className="text-sm">
                    <Tags />
                  </div>
                  <div className="ml-2 text-sm">{question.tags.join(", ")}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 space-x-2">
              <Link href={`/questions/${question.id}`}>
                <Button variants={{ variant: "primary" }} className="w-24">
                  View
                </Button>
              </Link>
              <Button variants={{ variant: "primary" }} className="w-24">
                Edit
              </Button>
              <Button variants={{ variant: "primary" }} className="w-24">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
