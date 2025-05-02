import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const LessonNavigation = ({
  courseId,
  sectionId,
  prevLesson,
  nextLesson,
  isCompleted,
}) => {
  return (
    <div className="lesson-nav mt-6">
      <div className="flex justify-between items-center">
        {/* Previous Lesson Button */}
        <div>
          {prevLesson ? (
            <Link
              to={`/courses/${courseId}/sections/${sectionId}/lessons/${prevLesson.id}`}
              className="btn btn-secondary flex items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span className="hidden sm:inline">Previous:</span>{" "}
              {prevLesson.title}
            </Link>
          ) : (
            <Link
              to={`/courses/${courseId}`}
              className="btn btn-secondary flex items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Course
            </Link>
          )}
        </div>

        {/* Next Lesson Button */}
        <div>
          {nextLesson ? (
            <Link
              to={`/courses/${courseId}/sections/${sectionId}/lessons/${nextLesson.id}`}
              className={`btn ${
                isCompleted ? "btn-primary" : "btn-secondary"
              } flex items-center`}
            >
              <span className="hidden sm:inline">Next:</span> {nextLesson.title}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          ) : (
            <Link
              to={`/courses/${courseId}`}
              className="btn btn-primary flex items-center"
            >
              Complete Course
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonNavigation;
