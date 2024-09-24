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
            <span>{q.title}</span>
            <div className="ml-auto">
              <Link href={`/questions/${q.id}`}>
                <Button variants={{ variant: "primary" }}>View</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
