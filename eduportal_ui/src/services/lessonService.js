import api from "./api";

/**
 * Fetch a section with its lessons
 * @param {string} courseId - The ID of the course
 * @param {string} sectionId - The ID of the section
 * @returns {Promise<Object>} Section data with lessons
 */
export const fetchSection = async (courseId, sectionId) => {
  try {
    const response = await api.get(
      `/courses/${courseId}/sections/${sectionId}/lessons`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching section ${sectionId}:`, error);
    throw error;
  }
};

/**
 * Fetch a lesson by ID
 * @param {string} courseId - The ID of the course
 * @param {string} sectionId - The ID of the section
 * @param {string} lessonId - The ID of the lesson
 * @returns {Promise<Object>} Lesson data
 */
export const fetchLesson = async (courseId, sectionId, lessonId) => {
  try {
    const response = await api.get(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Mark a lesson as complete
 * @param {string} courseId - The ID of the course
 * @param {string} sectionId - The ID of the section
 * @param {string} lessonId - The ID of the lesson
 * @returns {Promise<void>}
 */
export const markLessonComplete = async (courseId, sectionId, lessonId) => {
  try {
    await api.post(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/complete`
    );
  } catch (error) {
    console.error(`Error marking lesson ${lessonId} as complete:`, error);
    throw error;
  }
};

/**
 * Find the first incomplete lesson in a course
 * @param {Object} course - The course object
 * @param {Object} progress - The course progress object
 * @returns {Object|null} The first incomplete lesson, or null if all lessons are complete
 */
export const findFirstIncompleteLesson = (course, progress) => {
  if (!course || !course.sections || !progress) return null;

  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      const lessonProgress = progress.lessonProgresses?.[lesson.id];
      if (!lessonProgress || !lessonProgress.completed) {
        return {
          courseId: course.id,
          sectionId: section.id,
          lessonId: lesson.id,
          title: lesson.title,
        };
      }
    }
  }

  return null;
};

/**
 * Check if a lesson is the last in a course
 * @param {Object} course - The course object
 * @param {string} lessonId - The ID of the lesson
 * @returns {boolean} True if it's the last lesson, false otherwise
 */
export const isLastLesson = (course, lessonId) => {
  if (!course || !course.sections) return false;

  const lastSection = course.sections[course.sections.length - 1];

  return (
    lastSection.lessons.length > 0 &&
    lastSection.lessons[lastSection.lessons.length - 1].id === lessonId
  );
};
