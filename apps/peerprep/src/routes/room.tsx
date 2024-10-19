import { MarkdownRenderer } from "@peerprep/ui/markdown-renderer";
import { useQuestion } from "@peerprep/utils/client";
import { useLocation, useParams } from "react-router-dom";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const location = useLocation();
  const { matched, questionId } = location.state || {};

  const { data: question } = useQuestion(questionId);

  if (!question) return <div>Question not found.</div>;

  return (
    // <div className="flex w-full flex-row justify-center px-6 py-12">
    //   <div className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12">
    //     <p>Room ID: {id}</p>
    //     {matched && <p>Matched Users: {matched.join(", ")}</p>}
    //     {questionId && <p>Question ID: {questionId}</p>}
    //   </div>
    // </div>
    <div className="flex h-full w-full gap-6">
      <div className="bg-main-900 flex w-full flex-grow flex-col gap-6 overflow-auto p-12">
        <p>Room ID: {id}</p>
        {matched && <p>Matched Users: {matched.join(", ")}</p>}
        <h1 className="text-2xl font-semibold text-white">{question.title}</h1>
        <div className="prose prose-stone prose-invert max-w-full">
          {<MarkdownRenderer markdown={question.content} />}
        </div>
      </div>

      <div className="bg-main-900 flex w-full flex-grow flex-col gap-6 p-12">
        {questionId && <p>Question ID: {questionId}</p>}
      </div>
    </div>
  );
}
