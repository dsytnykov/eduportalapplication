import React, { useEffect, useMemo } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import CodeBlock from "../lessons/CodeBlock";

const SectionContent = ({ content }) => {
  const unwrappedContent = useMemo(() => {
    if (!content) return null;
    return content["en-US"] ? content["en-US"] : content;
  }, [content]);

  useEffect(() => {
    Prism.highlightAll();
  }, [unwrappedContent]);

  if (!unwrappedContent) {
    return (
      <div className="text-center py-8 text-gray-500">
        No content available for this section.
      </div>
    );
  }

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="mb-4">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>
      ),

      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc pl-6 mb-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <li className="mb-1">{children}</li>
      ),

      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children}
        </blockquote>
      ),

      [BLOCKS.HR]: () => <hr className="my-6 border-gray-300" />,

      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { title, description, file } = node.data.target.fields;
        const { url, contentType } = file;

        if (contentType.startsWith("image/")) {
          return (
            <div className="my-4">
              <img
                src={url}
                alt={description || title}
                className="max-w-full h-auto rounded"
              />
              {description && (
                <p className="text-center text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
          );
        }

        return (
          <div className="my-4 p-4 bg-gray-100 rounded">
            <p>Embedded asset: {title}</p>
          </div>
        );
      },

      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entry = node.data.target;
        const contentType = entry.sys.contentType.sys.id;

        if (contentType === "codeExample") {
          return (
            <CodeBlock
              language={entry.fields.language}
              code={entry.fields.code}
              title={entry.fields.title}
              description={entry.fields.description}
            />
          );
        }

        return (
          <div className="my-4 p-4 bg-gray-100 rounded">
            <p>Embedded content: {entry.fields.title || "Untitled"}</p>
          </div>
        );
      },

      [INLINES.HYPERLINK]: (node, children) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="section-content prose prose-blue max-w-none">
      {documentToReactComponents(unwrappedContent, options)}
    </div>
  );
};

export default SectionContent;
