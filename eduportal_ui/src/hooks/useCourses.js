import { useState, useEffect } from "react";
import {
  fetchCourses,
  fetchFeaturedCourses,
  fetchCourseById,
  fetchCoursesByTag,
} from "../services/courseService";

const useCourses = (type = "all", param = null) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        switch (type) {
          case "featured":
            data = await fetchFeaturedCourses();
            if (isMounted) setCourses(data);
            break;

          case "tag":
            if (param) {
              data = await fetchCoursesByTag(param);
              if (isMounted) setCourses(data);
            }
            break;

          case "single":
            if (param) {
              data = await fetchCourseById(param);
              if (isMounted) setCourse(data);
            }
            break;

          case "all":
          default:
            data = await fetchCourses();
            if (isMounted) setCourses(data);
            break;
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load courses. Please try again.");
          console.error("Error in useCourses hook:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [type, param]);

  return {
    courses,
    course,
    loading,
    error,
    setCourses,
    setCourse,
  };
};

export default useCourses;
