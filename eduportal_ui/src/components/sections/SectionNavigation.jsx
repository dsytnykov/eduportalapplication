import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const SectionNavigation = ({ courseId, prevSection, nextSection, isCompleted }) => {
  return (
    <div className="flex justify-between items-center mt-6">
      {/* Previous Section Button */}
      <div>
        {prevSection ? (
          <Link 
            to={`/courses/${courseId}/sections/${prevSection.id}`}
            className="btn btn-secondary flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="hidden sm:inline">Previous:</span> {prevSection.title}
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
      
      {/* Next Section Button */}
      <div>
        {nextSection ? (
          <Link 
            to={`/courses/${courseId}/sections/${nextSection.id}`}
            className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'} flex items-center`}
          >
            <span className="hidden sm:inline">Next:</span> {nextSection.title}
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
  );
};

export default SectionNavigation;