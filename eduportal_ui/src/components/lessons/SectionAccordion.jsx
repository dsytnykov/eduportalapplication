import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faBookOpen,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const SectionAccordion = ({ section, courseId, progress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const isSectionCompleted = () => {
    if (!progress || !progress.sectionProgresses) return false;
    return progress.sectionProgresses[section.id]?.completed || false;
  };

  const completed = isSectionCompleted();

  const hasLessons = section.lessons && section.lessons.length > 0;

  return (
    <div className="py-4">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <Link
          to={`/courses/${courseId}/sections/${section.id}`}
          className="flex items-start flex-grow hover:text-blue-600"
        >
          <div className="mr-3 mt-1">
            {completed ? (
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
            ) : (
              <FontAwesomeIcon icon={faBookOpen} className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className={`font-medium ${completed ? "text-gray-500" : ""}`}>
              {section.title}
            </h3>
            {hasLessons && (
              <div className="text-sm text-gray-600">
                {section.lessons.length} lesson
                {section.lessons.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </Link>

        {/* Expand/Collapse (only if has lessons) */}
        {hasLessons && (
          <button
            className="ml-4 text-gray-500 focus:outline-none p-1"
            onClick={toggleAccordion}
            aria-expanded={isOpen}
          >
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </button>
        )}
      </div>

      {/* Lessons List (if expanded) */}
      {isOpen && hasLessons && (
        <div className="mt-3 ml-8 pl-3 border-l-2 border-gray-200">
          <ul className="space-y-2">
            {section.lessons.map((lesson, index) => (
              <li key={lesson.id} className="py-1">
                <Link
                  to={`/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}`}
                  className="hover:text-blue-600 flex items-center"
                >
                  <span className="text-sm text-gray-500 mr-2">
                    {index + 1}.
                  </span>
                  <span>{lesson.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SectionAccordion;
