import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const TagFilter = ({ tags, selectedTag, onSelectTag }) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No tags available</div>
    );
  }

  const sortedTags = [...tags].sort((a, b) => a.localeCompare(b));

  return (
    <div className="max-h-64 overflow-y-auto">
      <div className="p-2">
        {/* "All" option */}
        <button
          className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
            selectedTag === "" ? "bg-blue-50 text-blue-700" : ""
          }`}
          onClick={() => onSelectTag("")}
        >
          <div className="flex items-center justify-between">
            <span>All Tags</span>
            {selectedTag === "" && (
              <FontAwesomeIcon icon={faCheck} className="text-blue-600" />
            )}
          </div>
        </button>

        {/* Individual tag options */}
        {sortedTags.map((tag, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
              selectedTag === tag ? "bg-blue-50 text-blue-700" : ""
            }`}
            onClick={() => onSelectTag(tag)}
          >
            <div className="flex items-center justify-between">
              <span>{tag}</span>
              {selectedTag === tag && (
                <FontAwesomeIcon icon={faCheck} className="text-blue-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
