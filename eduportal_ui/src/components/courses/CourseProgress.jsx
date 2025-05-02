import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const CourseProgress = ({ progress }) => {
  if (!progress) return null;
  
  const { totalSections, completedSections, progressPercentage } = progress;
  const isComplete = totalSections > 0 && completedSections === totalSections;
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Your Progress</span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-bar mb-2">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Progress Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-gray-600">
          {completedSections} of {totalSections} section{totalSections !== 1 ? 's' : ''} completed
        </div>
        
        {/* Completion Message */}
        {isComplete && (
          <div className="text-green-600 font-medium flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="mr-1" />
            Course Completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgress;