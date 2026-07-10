import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface ChatMessageContentProps {
  content: string;
  variant: "user" | "assistant";
}

export default function ChatMessageContent({
  content,
  variant,
}: ChatMessageContentProps) {
  if (variant === "user") {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-50">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
        ul: ({ children }) => (
          <ul className="my-2 space-y-1.5 pl-4 list-disc marker:text-amber-500">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 space-y-1.5 pl-4 list-decimal marker:text-amber-500">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-zinc-300">{children}</li>,
        a: ({ href, children }) => {
          const linkClass =
            "font-medium text-amber-400 underline decoration-amber-500/40 underline-offset-2 transition-colors hover:text-amber-300";

          if (href?.startsWith("/")) {
            return (
              <Link href={href} className={linkClass}>
                {children}
              </Link>
            );
          }

          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {children}
            </a>
          );
        },
        h3: ({ children }) => (
          <h3 className="mb-1.5 mt-3 text-sm font-semibold text-zinc-100 first:mt-0">
            {children}
          </h3>
        ),
        hr: () => <hr className="my-3 border-zinc-700" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
