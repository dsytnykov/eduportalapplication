import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and short description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FontAwesomeIcon
                icon={faBook}
                className="text-blue-400 text-2xl"
              />
              <span className="font-bold text-xl">Educational Portal</span>
            </Link>
            <p className="text-gray-300">
              Your platform for continued learning and development. Access
              high-quality courses anytime, anywhere.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/courses" className="text-gray-300 hover:text-white">
                All Courses
              </Link>
              <Link
                to="/courses/featured"
                className="text-gray-300 hover:text-white"
              >
                Featured Courses
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Sign In
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="flex items-center space-x-2 text-gray-300 mb-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>support@eduportal.com</span>
            </p>
            <p className="text-gray-300">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {year} Educational Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
