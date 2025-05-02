import api from "./api";

/**
 * Fetch all published courses
 * @returns {Promise<Array>} List of courses
 */
export const fetchCourses = async () => {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

/**
 * Fetch featured courses
 * @returns {Promise<Array>} List of featured courses
 */
export const fetchFeaturedCourses = async () => {
  try {
    const response = await api.get("/courses/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    throw error;
  }
};

/**
 * Fetch a course by ID
 * @param {string} courseId - The ID of the course
 * @returns {Promise<Object>} Course data
 */
export const fetchCourseById = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Fetch courses by tag
 * @param {string} tagName - The tag name to filter by
 * @returns {Promise<Array>} List of courses with the specified tag
 */
export const fetchCoursesByTag = async (tagName) => {
  try {
    const response = await api.get(`/courses/tag/${tagName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching courses with tag ${tagName}:`, error);
    throw error;
  }
};

/**
 * Fetch sections for a course
 * @param {string} courseId - The ID of the course
 * @returns {Promise<Array>} List of sections
 */
export const fetchCourseSections = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}/sections`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sections for course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Fetch user progress for a course
 * @param {string} courseId - The ID of the course
 * @returns {Promise<Object>} Course progress data
 */
export const fetchCourseProgress = async (courseId) => {
  try {
    const response = await api.get(`/user/progress/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for course ${courseId}:`, error);
    if (error.response && error.response.status === 401) {
      return {
        courseId,
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
        lessonProgresses: {},
      };
    }
    throw error;
  }
};
