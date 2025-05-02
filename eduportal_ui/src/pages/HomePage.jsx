import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faGraduationCap,
  faChartLine,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import useCourses from "../hooks/useCourses";
import useAuth from "../hooks/useAuth";
import CourseCard from "../components/courses/CourseCard";
import Loader from "../components/common/Loader";

const HomePage = () => {
  const { courses, loading, error } = useCourses("featured");
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Hero Section - Updated with gradient */}
      <section className="hero-section">
        <div className="container mx-auto px-4 text-center">
          <h1 className="hero-title">Expand Your Knowledge</h1>
          <p className="hero-description">
            Access high-quality educational content to enhance your skills and
            boost your career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="btn btn-white">
              Browse Courses
            </Link>
            {!currentUser && (
              <Link to="/register" className="btn btn-primary">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section bg-color-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-text-dark">
              Featured Courses
            </h2>
            <Link to="/courses" className="text-primary flex items-center">
              View all <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured courses..." />
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              No featured courses available yet.
            </div>
          ) : (
            <div className="courses-grid">
              {courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Updated with new color scheme */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-3xl font-bold text-center mb-8">
            Why Choose Our Platform
          </h2>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Primary Blue */}
            <div className="feature-item text-center">
              <div className="feature-icon feature-icon-primary mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} size="lg" />
              </div>
              <h3 className="feature-title text-xl font-bold mb-2">
                Quality Education
              </h3>
              <p className="feature-description">
                Access professionally curated content designed to give you
                practical, applicable knowledge.
              </p>
            </div>

            {/* Feature 2 - Secondary Teal */}
            <div className="feature-item text-center">
              <div className="feature-icon feature-icon-secondary mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} size="lg" />
              </div>
              <h3 className="feature-title text-xl font-bold mb-2">
                Track Your Progress
              </h3>
              <p className="feature-description">
                Watch your knowledge grow with our progress tracking system that
                helps you stay motivated.
              </p>
            </div>

            {/* Feature 3 - Accent Orange */}
            <div className="feature-item text-center">
              <div className="feature-icon feature-icon-accent mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faNoteSticky} size="lg" />
              </div>
              <h3 className="feature-title text-xl font-bold mb-2">
                Take Notes
              </h3>
              <p className="feature-description">
                Create and organize notes as you learn to help reinforce your
                understanding of key concepts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated with gradient background */}
      <section className="hero-section py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Join thousands of learners who are advancing their careers through
            our educational platform.
          </p>
          <Link to="/courses" className="btn btn-white">
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
