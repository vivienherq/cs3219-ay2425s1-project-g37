import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = memo(function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-stone prose-invert max-w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
});
