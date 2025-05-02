import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBook,
  faNoteSticky,
  faSignOutAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { fetchCourses } from "../services/courseService";
import useAuth from "../hooks/useAuth";
import useNotes from "../hooks/useNotes";
import Loader from "../components/common/Loader";

const ProfilePage = () => {
  const { currentUser, signOut } = useAuth();
  const { notes } = useNotes();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserCourses = async () => {
      setLoading(true);

      try {
        const coursesData = await fetchCourses();
        const startedCourses = coursesData.filter(
          (course) => course.completedLessons > 0
        );
        setCourses(startedCourses);
      } catch (err) {
        console.error("Error loading user courses:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUserCourses();
  }, []);

  const userDisplayName =
    currentUser?.displayName || currentUser?.email || "User";

  const formatJoinDate = () => {
    if (!currentUser?.metadata?.creationTime) return "Unknown";

    const creationDate = new Date(currentUser.metadata.creationTime);

    return creationDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faUserCircle} className="text-5xl" />
              </div>

              <h2 className="text-xl font-bold text-center">
                {userDisplayName}
              </h2>
              <p className="text-gray-600 text-sm">
                Member since {formatJoinDate()}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </h3>
                <p>{currentUser?.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Your Activity
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span>Courses in progress:</span>
                  <span className="font-medium">{courses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notes created:</span>
                  <span className="font-medium">{notes.length}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary w-full flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Courses In Progress & Notes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Courses In Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 mr-2" />
              My Courses
            </h2>

            {loading ? (
              <Loader size="md" text="Loading your courses..." />
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  You haven't started any courses yet.
                </p>
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition"
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-start"
                    >
                      <div className="flex-grow">
                        <h3 className="font-medium mb-1">{course.title}</h3>

                        <div className="text-sm text-gray-600 mb-2">
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons completed
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 rounded-full h-2"
                            style={{
                              width: `${Math.round(
                                (course.completedLessons /
                                  course.totalLessons) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Completed Badge */}
                      {course.completedLessons === course.totalLessons && (
                        <div
                          className="ml-4 text-green-500 flex-shrink-0"
                          title="Course completed"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-xl"
                          />
                        </div>
                      )}
                    </Link>
                  </div>
                ))}

                <div className="mt-4 text-center">
                  <Link
                    to="/courses"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    See all courses
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="text-blue-600 mr-2"
              />
              Recent Notes
            </h2>

            {notes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  You haven't created any notes yet.
                </p>
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses to Add Notes
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Display only most recent 3 notes */}
                  {notes
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt || b.createdAt) -
                        new Date(a.updatedAt || a.createdAt)
                    )
                    .slice(0, 3)
                    .map((note) => (
                      <div
                        key={note.id}
                        className="border border-gray-200 rounded-md p-4"
                      >
                        <p className="line-clamp-3 mb-2 text-gray-800">
                          {note.content}
                        </p>

                        <div className="text-xs text-gray-500">
                          {new Date(
                            note.updatedAt || note.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                  <Link to="/notes" className="btn btn-secondary">
                    View All Notes
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
