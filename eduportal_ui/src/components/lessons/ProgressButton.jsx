import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const ProgressButton = ({ completed, loading, onClick }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex justify-center mb-6">
      <button
        className={`btn ${
          completed ? "bg-green-500 hover:bg-green-600" : "btn-primary"
        } flex items-center px-6`}
        onClick={onClick}
        disabled={completed || loading}
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Marking as Complete...
          </>
        ) : completed ? (
          <>
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Lesson Completed
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Mark as Complete
          </>
        )}
      </button>
    </div>
  );
};

export default ProgressButton;
