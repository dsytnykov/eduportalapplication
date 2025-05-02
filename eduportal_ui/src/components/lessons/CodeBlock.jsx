import React, { useEffect } from "react";
import Prism from "prismjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const CodeBlock = ({ language, code, title, description }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("Code copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  const getPrismLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      typescript: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      html: "html",
      css: "css",
      java: "java",
      python: "python",
      go: "go",
      bash: "bash",
      sql: "sql",
    };

    return languageMap[lang?.toLowerCase()] || "javascript";
  };

  return (
    <div className="my-6 rounded-md overflow-hidden">
      {/* Code block header */}
      <div className="bg-gray-800 text-gray-200 px-4 py-2 flex justify-between items-center">
        <div>
          {title && <span className="font-medium">{title}</span>}
          {title && language && <span className="mx-2">|</span>}
          {language && <span className="text-sm">{language}</span>}
        </div>
        <button
          onClick={handleCopyCode}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label="Copy code"
          title="Copy code"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>

      {/* Code content */}
      <pre className="m-0 p-0">
        <code className={`language-${getPrismLanguage(language)}`}>{code}</code>
      </pre>

      {/* Optional description */}
      {description && (
        <div className="bg-gray-100 text-gray-700 px-4 py-2 text-sm">
          {description}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
