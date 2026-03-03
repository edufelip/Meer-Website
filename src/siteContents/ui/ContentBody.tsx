import ReactMarkdown from "react-markdown";
import { GuideContentDto } from "../types";

type ContentBodyProps = {
  content: GuideContentDto;
};

export function ContentBody({ content }: ContentBodyProps) {
  return (
    <div className="lg:col-span-8 font-body text-lg leading-relaxed text-text-body dark:text-text-body-dark">
      <div className="markdown-body">
        <ReactMarkdown>{content.description}</ReactMarkdown>
      </div>

      <hr className="border-stone-200 dark:border-stone-700 my-12" />
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#GuiaBrecho</span>
          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#Achados</span>
          {content.thriftStoreName && (
            <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#{content.thriftStoreName.replace(/\s+/g, '')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
