import { useQuestions } from "~/lib/questions";

export default function IndexPage() {
  const { isLoading, data: questions } = useQuestions();
  if (isLoading) return null;
  return (
    <div>
      <div>The questions added so far:</div>
      <pre>{JSON.stringify(questions, null, 2)}</pre>
    </div>
  );
}
