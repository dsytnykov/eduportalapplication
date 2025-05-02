import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faList,
  faNoteSticky,
  faTimes,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { fetchLesson } from "../services/lessonService";
import { fetchCourseById } from "../services/courseService";
import LessonContent from "../components/lessons/LessonContent";
import LessonNavigation from "../components/lessons/LessonNavigation";
import ProgressButton from "../components/lessons/ProgressButton";
import NoteEditor from "../components/notes/NoteEditor";
import NoteList from "../components/notes/NoteList";
import useAuth from "../hooks/useAuth";
import useProgress from "../hooks/useProgress";
import useNotes from "../hooks/useNotes";
import Loader from "../components/common/Loader";

const LessonPage = () => {
  const { courseId, sectionId, lessonId } = useParams();
  const { currentUser } = useAuth();
  const { progress, completeLesson, isLessonCompleted } = useProgress(courseId);
  const { contentNotes, loadContentNotes } = useNotes();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [lessonData, courseData] = await Promise.all([
          fetchLesson(courseId, sectionId, lessonId),
          fetchCourseById(courseId),
        ]);

        setLesson(lessonData);
        setCourse(courseData);

        if (currentUser) {
          loadContentNotes(lessonId);
        }
      } catch (err) {
        console.error("Error loading lesson:", err);
        setError("Failed to load lesson content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    window.scrollTo(0, 0);
  }, [courseId, sectionId, lessonId, currentUser, loadContentNotes]);

  const handleMarkComplete = async () => {
    if (!currentUser || completingLesson) return;

    setCompletingLesson(true);

    try {
      await completeLesson(sectionId, lessonId);

      if (lesson.nextLesson) {
        navigate(
          `/courses/${courseId}/sections/${sectionId}/lessons/${lesson.nextLesson.id}`
        );
      }
    } catch (err) {
      console.error("Error marking lesson as complete:", err);
    } finally {
      setCompletingLesson(false);
    }
  };

  const lessonNotes = contentNotes[lessonId] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Loader />
      </div>
    );
  }

  if (error || !lesson) {
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
            {error || "Lesson not found."}
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
                {lessonNotes.length > 0 && !showNotes && (
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    {lessonNotes.length}
                  </span>
                )}
              </button>
            )}

            <Link
              to={`/courses/${courseId}`}
              className="btn btn-secondary text-sm"
              title="Course Contents"
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              Contents
            </Link>
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
              {/* Lesson Title */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold mb-0">{lesson.title}</h1>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <LessonContent content={lesson.content} />
              </div>

              {/* Lesson Navigation */}
              <div className="border-t border-gray-200">
                <div className="p-4">
                  <ProgressButton
                    completed={isLessonCompleted(lessonId)}
                    loading={completingLesson}
                    onClick={handleMarkComplete}
                  />

                  <LessonNavigation
                    courseId={courseId}
                    sectionId={sectionId}
                    prevLesson={lesson.prevLesson}
                    nextLesson={lesson.nextLesson}
                    isCompleted={isLessonCompleted(lessonId)}
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
                  <h2 className="text-lg font-bold">Notes for this Lesson</h2>
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
                      <NoteEditor contentfulEntryId={lessonId} />
                      <div className="mt-6">
                        <NoteList notes={lessonNotes} />
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

export default LessonPage;
