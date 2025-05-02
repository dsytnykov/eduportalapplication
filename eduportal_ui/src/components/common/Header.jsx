import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faNoteSticky,
  faSignOutAlt,
  faSignInAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faBook} className="text-blue-600 text-2xl" />
            <span className="font-bold text-xl">Educational Portal</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/notes"
                  className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
                >
                  <FontAwesomeIcon icon={faNoteSticky} />
                  <span>My Notes</span>
                </Link>

                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3">
            <Link
              to="/courses"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/notes"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faNoteSticky} />
                  <span>My Notes</span>
                </Link>

                <Link
                  to="/profile"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
