import { Button } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";
import { MarkdownRenderer } from "@peerprep/ui/markdown-renderer";
import { QuestionDifficultyLabel } from "@peerprep/ui/question-difficulty-label";
import { ChevronLeft, Pen, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import type { Question } from "@peerprep/schemas";

import { useQuestion, useEditQuestion } from "~/lib/questions";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const { data: question, mutate } = useQuestion(id);
  const { trigger: editQuestion, isMutating } = useEditQuestion(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  if (!question)
    return (
      <div>
        Question not found.{" "}
        <Link href="/" className="text-main-50 font-bold underline-offset-4 hover:underline">
          Return home
        </Link>
        .
      </div>
    );

  const handleEditClick = () => {
    setEditedQuestion(question);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (editedQuestion) {
      setEditedQuestion({
        ...editedQuestion,
        [name]: name === 'tags' ? value.split(",").map(tag => tag.trim()) : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedQuestion) {
      try {
        await editQuestion(editedQuestion);
        setIsEditing(false);
        await mutate();
      } catch (error) {
        console.error("Load failed", error);
        alert("Error saving changes.");
      }
    }
  };

  return (
    <div className="grid grid-cols-3 items-start gap-9">
      <div className="sticky top-6 flex flex-col gap-6">
        <div className="bg-main-900 flex flex-col gap-6 p-9">
          <h1 className="text-2xl font-semibold text-white">{question.title}</h1>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleEditClick} variants={{ variant: "secondary" }}>
              <Pen />
              Edit
            </Button>
            <Button variants={{ variant: "secondary" }}>
              <Trash2 />
              Delete
            </Button>
          </div>
          <dl className="[&_dt]:text-main-400 -mb-6 mt-6 [&_dd]:mb-6 [&_dt]:mb-1.5 [&_dt]:text-xs [&_dt]:uppercase [&_dt]:tracking-wider">
            <dt>Difficulty</dt>
            <dd>
              <QuestionDifficultyLabel size="lg" difficulty={question.difficulty} />
            </dd>
            <dt>Tags</dt>
            <dd className="flex flex-col">
              {question.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </dd>
            <dt>LeetCode link</dt>
            <dd>
              <Link
                href={question.leetCodeLink}
                className="text-main-50 font-semibold underline-offset-4 hover:underline"
              >
                See on LeetCode
              </Link>
            </dd>
            <dt>Added</dt>
            <dd>{new Date(question.createdAt).toLocaleString()}</dd>
            <dt>Updated</dt>
            <dd>{new Date(question.updatedAt).toLocaleString()}</dd>
          </dl>
        </div>
        <Link
          href="/questions"
          className="text-main-400 flex w-fit flex-row items-center gap-1.5 text-sm"
        >
          <ChevronLeft />
          Back to question list
        </Link>
      </div>
      <div className="bg-main-900 col-span-2 p-9">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-main-400 text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={editedQuestion?.content || ""}
                onChange={handleChange}
                className="min-h-[200px] p-3 bg-main-800 text-white rounded-md border border-main-700 focus:outline-none focus:ring-2 focus:ring-main-500 transition duration-200"
                placeholder="Edit question content"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="difficulty" className="text-main-400 text-sm font-medium">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={editedQuestion?.difficulty || ""}
                onChange={handleChange}
                className="p-3 bg-main-800 text-white rounded-md border border-main-700 focus:outline-none focus:ring-2 focus:ring-main-500 transition duration-200"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tags" className="text-main-400 text-sm font-medium">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                value={editedQuestion?.tags.join(", ") || ""}
                onChange={handleChange}
                className="p-3 bg-main-800 text-white rounded-md border border-main-700 focus:outline-none focus:ring-2 focus:ring-main-500 transition duration-200"
                placeholder="Edit tags (comma separated)"
              />
            </div>

            <Button type="submit" disabled={isMutating} className="mt-4">
              {isMutating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        ) : (
          <div className="prose prose-stone prose-invert max-w-full">
            <MarkdownRenderer markdown={question.content} />
          </div>
        )}
      </div>
    </div>
  );
}
