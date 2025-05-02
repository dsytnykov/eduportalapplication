import { useState, useEffect, useCallback } from "react";
import { fetchCourseProgress } from "../services/courseService";
import { markSectionComplete } from "../services/sectionService";
import useAuth from "./useAuth";

/**
 * Custom hook for managing course progress
 * @param {string} courseId - The ID of the course
 */
const useProgress = (courseId) => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!courseId || !currentUser) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadProgress = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchCourseProgress(courseId);
        if (isMounted) setProgress(data);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load progress. Please try again.");
          console.error("Error in useProgress hook:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [courseId, currentUser]);

  const completeSection = useCallback(
    async (sectionId) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        await markSectionComplete(courseId, sectionId);

        setProgress((prev) => {
          if (!prev) return prev;

          const newSectionProgresses = {
            ...prev.sectionProgresses,
            [sectionId]: {
              sectionId,
              completed: true,
              completedAt: Date.now(),
            },
          };

          const completedCount = Object.values(newSectionProgresses).filter(
            (sp) => sp.completed
          ).length;

          return {
            ...prev,
            completedSections: completedCount,
            progressPercentage: (completedCount / prev.totalSections) * 100,
            sectionProgresses: newSectionProgresses,
          };
        });

        return true;
      } catch (err) {
        setError("Failed to mark section as complete. Please try again.");
        console.error("Error completing section:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, courseId]
  );

  const isLessonCompleted = useCallback((lessonId) => {
    return false;
  }, []);

  const isSectionCompleted = useCallback(
    (sectionId) => {
      if (!progress || !progress.sectionProgresses) return false;
      return progress.sectionProgresses[sectionId]?.completed || false;
    },
    [progress]
  );

  return {
    progress,
    loading,
    error,
    completeSection,
    isSectionCompleted,
    isLessonCompleted,
  };
};

export default useProgress;
