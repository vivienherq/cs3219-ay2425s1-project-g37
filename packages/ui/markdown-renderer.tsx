import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Question {
  id: string;
  title: string;
  content: string;
  difficulty: string;
  tags: string[];
  leetCodeLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export function MarkdownRenderer({ question }: { question: Question }) {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.content}</ReactMarkdown>
    </div>
  );
}
