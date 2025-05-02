import api from "./api";

const sectionCache = new Map();
const CACHE_EXPIRY = 60000;

/**
 * Fetch a section by ID
 * @param {string} courseId - The ID of the course
 * @param {string} sectionId - The ID of the section
 * @returns {Promise<Object>} Section data
 */
export const fetchSection = async (courseId, sectionId) => {
  const cacheKey = `${courseId}-${sectionId}`;
  const now = Date.now();

  if (sectionCache.has(cacheKey)) {
    const cachedData = sectionCache.get(cacheKey);
    if (now - cachedData.timestamp < CACHE_EXPIRY) {
      console.log(`Using cached section data for ${sectionId}`);
      return cachedData.data;
    }
  }

  console.log(`Fetching section ${sectionId} for course ${courseId} from API`);
  try {
    const response = await api.get(
      `/courses/${courseId}/sections/${sectionId}`
    );

    sectionCache.set(cacheKey, {
      data: response.data,
      timestamp: now,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching section ${sectionId}:`, error);
    throw error;
  }
};

/**
 * Mark a section as complete
 * @param {string} courseId - The ID of the course
 * @param {string} sectionId - The ID of the section
 * @returns {Promise<void>}
 */
export const markSectionComplete = async (courseId, sectionId) => {
  console.log(`Marking section ${sectionId} as complete`);
  try {
    await api.post(`/courses/${courseId}/sections/${sectionId}/complete`);
  } catch (error) {
    console.error(`Error marking section ${sectionId} as complete:`, error);
    throw error;
  }
};

/**
 * Find the first incomplete section in a course
 * @param {Object} course - The course object
 * @param {Object} progress - The course progress object
 * @returns {Object|null} The first incomplete section, or null if all sections are complete
 */
export const findFirstIncompleteSection = (course, progress) => {
  if (!course || !course.sections || !progress) return null;

  for (const section of course.sections) {
    const sectionProgress = progress.sectionProgresses?.[section.id];
    if (!sectionProgress || !sectionProgress.completed) {
      return {
        courseId: course.id,
        sectionId: section.id,
        title: section.title,
      };
    }
  }

  return null;
};

/**
 * Check if a section is the last in a course
 * @param {Object} course - The course object
 * @param {string} sectionId - The ID of the section
 * @returns {boolean} True if it's the last section, false otherwise
 */
export const isLastSection = (course, sectionId) => {
  if (!course || !course.sections) return false;

  return (
    course.sections.length > 0 &&
    course.sections[course.sections.length - 1].id === sectionId
  );
};
