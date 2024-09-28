import { type Static, TypeCompiler, questions, t } from "@peerprep/schemas/validators";
import { buttonVariants } from "@peerprep/ui/button-variants";
import { cn } from "@peerprep/ui/cn";
import { Link } from "@peerprep/ui/link";
import { QuestionDifficultyLabel } from "@peerprep/ui/question-difficulty-label";
import { Tags } from "lucide-react";
import toast from "react-hot-toast";

import { useAddQuestions, useQuestions } from "~/lib/questions";

const createSchema = t.Union([t.Array(questions.createSchema), questions.createSchema]);
const compiledCreateSchema = TypeCompiler.Compile(createSchema);

export default function QuestionsPage() {
  const { data: questions } = useQuestions();
  const { trigger, isMutating } = useAddQuestions();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (isMutating) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const json = JSON.parse(await file.text());
    if (!compiledCreateSchema.Check(json)) {
      toast.error(
        <>
          Invalid JSON file. Content must be <code>Question</code> or <code>Question[]</code>.
        </>,
      );
      return;
    }

    const data: Static<typeof createSchema> = json;
    await trigger(data);
    toast.success("Succesfully added the new questions!");
  }

  if (!questions) return null;
  return (
    <div className="mx-auto flex max-w-prose flex-col gap-6">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">Questions</h1>
        <label>
          <input
            id="new-question"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
            disabled={isMutating}
          />
          <span className={cn("cursor-pointer", buttonVariants({ variant: "primary" }))}>
            Add questions via JSON
          </span>
        </label>
      </div>
      {questions.length === 0 ? (
        <div>Nothing here yet. Please add some.</div>
      ) : (
        <ul className="flex flex-col gap-6">
          {questions.map(question => (
            <li key={question.id}>
              <Link
                href={`/questions/${question.id}`}
                className="bg-main-900 flex flex-col gap-1.5 p-6"
              >
                <h2 className="line-clamp-2 text-lg text-white">{question.title}</h2>
                <div className="flex flex-row items-center gap-6">
                  <QuestionDifficultyLabel difficulty={question.difficulty} />
                  <div className="text-main-500 flex flex-row items-center gap-1.5 text-sm">
                    <Tags />
                    <span>{question.tags.join(", ")}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
