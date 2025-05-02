import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faArrowLeft,
  faPlay,
  faSpinner,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import useCourses from "../hooks/useCourses";
import useProgress from "../hooks/useProgress";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import CourseProgress from "../components/courses/CourseProgress";
import SectionAccordion from "../components/lessons/SectionAccordion";
import { findFirstIncompleteSection } from "../services/sectionService";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    course,
    loading: courseLoading,
    error: courseError,
  } = useCourses("single", courseId);
  const { progress, loading: progressLoading } = useProgress(courseId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  const startOrContinueCourse = () => {
    if (!course) return;

    if (progress && progress.completedSections > 0) {
      const nextSection = findFirstIncompleteSection(course, progress);
      if (nextSection) {
        navigate(
          `/courses/${nextSection.courseId}/sections/${nextSection.sectionId}`
        );
      } else {
        const firstSection = course.sections?.[0];
        if (firstSection) {
          navigate(`/courses/${courseId}/sections/${firstSection.id}`);
        }
      }
    } else {
      const firstSection = course.sections?.[0];
      if (firstSection) {
        navigate(`/courses/${courseId}/sections/${firstSection.id}`);
      }
    }
  };

  const isLoading = courseLoading || (currentUser && progressLoading);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error loading course: {courseError}
        </div>
        <Link
          to="/courses"
          className="btn btn-secondary mt-4 inline-flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="btn btn-primary inline-flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const getRichTextContent = (content) => {
    if (!content) return null;

    if (content.nodeType === "document") {
      return content;
    }

    if (content["en-US"] && content["en-US"].nodeType === "document") {
      return content["en-US"];
    }

    for (const key in content) {
      if (content[key] && content[key].nodeType === "document") {
        return content[key];
      }
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        to="/courses"
        className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start">
          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-6 flex-shrink-0">
            <FontAwesomeIcon icon={faBook} className="text-2xl" />
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                {course.featured && (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-flex items-center mb-3">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    Featured Course
                  </div>
                )}
              </div>

              {/* Start/Continue Button */}
              <button
                className="btn btn-primary flex items-center"
                onClick={startOrContinueCourse}
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                {progress && progress.completedLessons > 0
                  ? "Continue Learning"
                  : "Start Course"}
              </button>
            </div>

            {/* Course tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <FontAwesomeIcon icon={faTag} className="text-gray-500 mt-1" />
                {course.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/courses?tag=${encodeURIComponent(tag)}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Course stats */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="mr-4">
                {course.totalLessons} lesson
                {course.totalLessons !== 1 ? "s" : ""}
              </span>

              {/* Progress percentage if user has started the course */}
              {progress && progress.completedLessons > 0 && (
                <span>
                  {progress.completedLessons} / {progress.totalLessons}{" "}
                  completed ({Math.round(progress.progressPercentage)}%)
                </span>
              )}
            </div>

            {/* Course description */}
            <div className="text-gray-700 mb-6">{course.description}</div>

            {/* Progress bar */}
            {currentUser && progress && <CourseProgress progress={progress} />}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Detailed Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">About This Course</h2>

            {/* Rich text content */}
            <div className="prose max-w-none">
              {course.content &&
                documentToReactComponents(
                  getRichTextContent(course.content) || {}
                )}
            </div>
          </div>
        </div>

        {/* Right Column - Course Structure */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>

            {course.sections && course.sections.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {course.sections.length} section
                  {course.sections.length !== 1 ? "s" : ""} •{" "}
                  {course.totalLessons} lesson
                  {course.totalLessons !== 1 ? "s" : ""}
                </div>

                {/* Course Sections Accordion */}
                <div className="divide-y divide-gray-200">
                  {course.sections.map((section) => (
                    <SectionAccordion
                      key={section.id}
                      section={section}
                      courseId={courseId}
                      progress={progress}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 italic">
                This course doesn't have any content yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
