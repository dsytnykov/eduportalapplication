import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faStar } from "@fortawesome/free-solid-svg-icons";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const {
    id,
    title,
    description,
    tags = [],
    featured,
    totalSections,
    completedSections,
    sections = [],
  } = course;

  const progressPercentage =
    totalSections > 0
      ? Math.round((completedSections / totalSections) * 100)
      : 0;

  const handleContinueLearning = (e) => {
    e.preventDefault();

    if (completedSections > 0) {
      const incompleteSection = sections.find((section) => !section.completed);

      if (incompleteSection) {
        navigate(`/courses/${id}/sections/${incompleteSection.id}`);
      } else if (sections.length > 0) {
        navigate(`/courses/${id}/sections/${sections[0].id}`);
      } else {
        navigate(`/courses/${id}`);
      }
    } else if (sections.length > 0) {
      navigate(`/courses/${id}/sections/${sections[0].id}`);
    } else {
      navigate(`/courses/${id}`);
    }
  };

  return (
    <div className="card course-card h-full flex flex-col">
      {/* Card Header */}
      <div className="bg-gray-100 p-4 relative">
        {featured && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded-bl-md flex items-center">
            <FontAwesomeIcon icon={faStar} className="mr-1" />
            Featured
          </div>
        )}
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
          <FontAwesomeIcon icon={faBook} className="text-xl" />
        </div>
        <h3 className="text-xl font-bold mb-1 line-clamp-2">{title}</h3>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description || "No description available."}
        </p>

        {/* Progress Bar (if user has started the course) */}
        {completedSections > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>
            {totalSections} section{totalSections !== 1 ? "s" : ""}
          </span>
          {completedSections > 0 && <span>{completedSections} completed</span>}
        </div>

        {/* Action Button */}
        {completedSections > 0 ? (
          <button
            onClick={handleContinueLearning}
            className="btn btn-primary w-full text-center mt-auto"
          >
            Continue Learning
          </button>
        ) : (
          <Link
            to={`/courses/${id}`}
            className="btn btn-primary w-full text-center mt-auto"
          >
            View Course
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
