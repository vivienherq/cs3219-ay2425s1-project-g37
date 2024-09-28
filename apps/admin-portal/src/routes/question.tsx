import { MarkdownRenderer } from "@peerprep/ui/markdown-renderer";
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
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-main-50 text-2xl">{question?.title}</h1>
        <div className="flex space-x-2">
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Edit
          </button>
          <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
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
      <div className="prose prose-stone prose-invert max-w-full">
        <MarkdownRenderer markdown={question.content} />
      </div>
    </div>
  );
}
