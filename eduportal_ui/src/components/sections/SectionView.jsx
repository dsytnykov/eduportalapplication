import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faSpinner,
  faNoteSticky,
  faTimes,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { fetchSection } from "../../services/sectionService";
import { fetchCourseById } from "../../services/courseService";
import SectionContent from "./SectionContent";
import SectionNavigation from "./SectionNavigation";
import NoteEditor from "../notes/NoteEditor";
import NoteList from "../notes/NoteList";
import useAuth from "../../hooks/useAuth";
import useProgress from "../../hooks/useProgress";
import useNotes from "../../hooks/useNotes";
import Loader from "../common/Loader";
import LessonsList from "../lessons/LessonsList";

const SectionView = () => {
  const { courseId, sectionId } = useParams();
  const { currentUser } = useAuth();
  const { progress, completeSection, isSectionCompleted } =
    useProgress(courseId);
  const { contentNotes, loadContentNotes } = useNotes();

  const [section, setSection] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [completingSection, setCompletingSection] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const [sectionData, courseData] = await Promise.all([
          fetchSection(courseId, sectionId),
          fetchCourseById(courseId),
        ]);

        if (!isMounted) return;

        setSection(sectionData);
        setCourse(courseData);

        if (currentUser) {
          loadContentNotes(sectionId);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading section:", err);
          setError("Failed to load section content. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [courseId, sectionId, currentUser]);

  const handleMarkComplete = useCallback(async () => {
    if (!currentUser || completingSection || !section) return;

    setCompletingSection(true);

    try {
      await completeSection(sectionId);

      if (section.nextSection) {
        navigate(`/courses/${courseId}/sections/${section.nextSection.id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    } catch (err) {
      console.error("Error marking section as complete:", err);
    } finally {
      setCompletingSection(false);
    }
  }, [
    currentUser,
    completingSection,
    section,
    sectionId,
    completeSection,
    navigate,
    courseId,
  ]);

  const sectionNotes = contentNotes[sectionId] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Loader />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to={`/courses/${courseId}`}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Course
          </Link>

          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error || "Section not found."}
          </div>

          <Link to={`/courses/${courseId}`} className="btn btn-primary">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to={`/courses/${courseId}`}
            className="text-gray-700 hover:text-blue-600 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Course
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <button
                className={`btn ${
                  showNotes ? "btn-primary" : "btn-secondary"
                } text-sm`}
                onClick={() => setShowNotes(!showNotes)}
              >
                <FontAwesomeIcon icon={faNoteSticky} className="mr-2" />
                {showNotes ? "Hide Notes" : "Show Notes"}
                {sectionNotes.length > 0 && !showNotes && (
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    {sectionNotes.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div
            className={`w-full ${
              showNotes ? "lg:w-2/3" : "lg:w-full"
            } transition-all duration-300`}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Title */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold mb-0">{section.title}</h1>
              </div>

              {/* Section Content */}
              <div className="p-6">
                <SectionContent content={section.content} />

                {/* Lessons List (if any) */}
                {section.lessons && section.lessons.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-bold mb-4">
                      Lessons in this Section
                    </h2>
                    <LessonsList
                      lessons={section.lessons}
                      courseId={courseId}
                      sectionId={sectionId}
                    />
                  </div>
                )}
              </div>

              {/* Section Navigation */}
              <div className="border-t border-gray-200">
                <div className="p-4">
                  {/* Complete Section Button */}
                  {currentUser && (
                    <div className="flex justify-center mb-6">
                      <button
                        className={`btn ${
                          isSectionCompleted(sectionId)
                            ? "bg-green-500 hover:bg-green-600"
                            : "btn-primary"
                        } flex items-center px-6`}
                        onClick={handleMarkComplete}
                        disabled={
                          isSectionCompleted(sectionId) || completingSection
                        }
                      >
                        {completingSection ? (
                          <>
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              className="mr-2"
                            />
                            Marking as Complete...
                          </>
                        ) : isSectionCompleted(sectionId) ? (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                            Section Completed
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                            Mark as Complete
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <SectionNavigation
                    courseId={courseId}
                    prevSection={section.prevSection}
                    nextSection={section.nextSection}
                    isCompleted={isSectionCompleted(sectionId)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="w-full lg:w-1/3 lg:pl-6 mt-6 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md h-full overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Notes for this Section</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNotes(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="p-4">
                  {currentUser ? (
                    <>
                      <NoteEditor contentfulEntryId={sectionId} />
                      <div className="mt-6">
                        <NoteList notes={sectionNotes} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Please sign in to create and view notes.
                      </p>
                      <Link
                        to={`/login?redirectUrl=${encodeURIComponent(
                          window.location.pathname
                        )}`}
                        className="btn btn-primary"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionView;
