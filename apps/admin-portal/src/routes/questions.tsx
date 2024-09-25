import { Button } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";

import { useQuestions } from "~/lib/questions";

export default function QuestionsPage() {
  const { data: questions } = useQuestions();
  if (!questions) return null;
  return (
    <div>
      Questions Page
      <div>
        {questions.map(q => (
          <div
            key={q.id}
            className="bg-main-900 my-4 flex items-center justify-between rounded-lg p-4"
          >
            <span className="flex-grow truncate">{q.title}</span>
            <div className="flex flex-shrink-0 space-x-2">
              <Link href={`/questions/${q.id}`}>
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
