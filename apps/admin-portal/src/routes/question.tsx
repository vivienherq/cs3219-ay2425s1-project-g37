import { Tags } from "lucide-react";
import { useParams } from "react-router-dom";

import { useQuestion } from "~/lib/questions";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: question } = useQuestion(id || "");
  console.log(id);
  if (isLoading) return null;
  if (!question) {
    return <div>Question not found.</div>;
  }

  let chipColor;
  switch (question.difficulty) {
    case "HARD":
      chipColor = "bg-red-600"; // Tailwind class for red
      break;
    case "MEDIUM":
      chipColor = "bg-yellow-500"; // Tailwind class for yellow
      break;
    case "EASY":
      chipColor = "bg-green-500"; // Tailwind class for green
      break;
    default:
      chipColor = "bg-gray-300"; // Default color if difficulty is unknown
  }
  return (
    <div className="bg-main-900 p-12">
      <h1 className="text-main-50 mb-2 text-2xl">{question?.title}</h1>
      <div className="mb-4 flex items-center">
        <div
          className={`inline-flex items-center justify-center px-2 py-1 text-white ${chipColor} text-sm`}
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

      <div>{question?.content}</div>
    </div>
  );
}
