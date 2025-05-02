import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const LessonsList = ({ lessons, courseId, sectionId }) => {
  if (!lessons || lessons.length === 0) {
    return null;
  }

  const sortedLessons = [...lessons].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <ul className="divide-y divide-gray-200">
        {sortedLessons.map((lesson, index) => (
          <li key={lesson.id} className="py-3">
            <Link
              to={`/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`}
              className="flex items-center hover:bg-gray-100 p-2 rounded transition-colors"
            >
              <div className="mr-3 text-blue-500">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <div className="flex-grow">
                <span className="font-medium">
                  {index + 1}. {lesson.title}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                className="text-gray-400 ml-2 text-sm"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsList;
