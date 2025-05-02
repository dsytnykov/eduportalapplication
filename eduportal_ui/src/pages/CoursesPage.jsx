import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import CourseCard from "../components/courses/CourseCard";
import TagFilter from "../components/courses/TagFilter";
import Loader from "../components/common/Loader";
import useCourses from "../hooks/useCourses";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [location.search]);

  const { courses, loading, error } = useCourses(
    selectedTag ? "tag" : "all",
    selectedTag
  );

  useEffect(() => {
    if (!courses) return;

    const filtered = courses.filter((course) => {
      const matchesSearchTerm =
        searchTerm === "" ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description &&
          course.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearchTerm;
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedTag]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);

    if (tag) {
      navigate(`/courses?tag=${encodeURIComponent(tag)}`);
    } else {
      navigate("/courses");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    navigate("/courses");
  };

  const allTags = courses
    ? [...new Set(courses.flatMap((course) => course.tags || []))]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Courses</h1>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="input pl-10"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <button
              className="btn btn-secondary flex items-center"
              onClick={() =>
                document
                  .getElementById("tagFilterDropdown")
                  .classList.toggle("hidden")
              }
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter by Tags
            </button>

            {/* Tag filter dropdown */}
            <div
              id="tagFilterDropdown"
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden"
            >
              <TagFilter
                tags={allTags}
                selectedTag={selectedTag}
                onSelectTag={handleTagSelect}
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(selectedTag || searchTerm) && (
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {selectedTag && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                  Tag: {selectedTag}
                  <button
                    onClick={() => handleTagSelect("")}
                    className="ml-2 focus:outline-none"
                    aria-label="Remove tag filter"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            No courses found matching your criteria.
          </p>
          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
