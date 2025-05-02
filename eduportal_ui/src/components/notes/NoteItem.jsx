import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSpinner,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import NoteEditor from "./NoteEditor";
import useNotes from "../../hooks/useNotes";

const NoteItem = ({ note }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeNote } = useNotes();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirm) {
      setIsDeleting(true);

      try {
        await removeNote(note.id);
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (isEditing) {
    return (
      <NoteEditor
        contentfulEntryId={note.contentfulEntryId}
        initialContent={note.content}
        noteId={note.id}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="note-item">
      {/* Note content */}
      <div className="mb-3 whitespace-pre-wrap text-gray-800">
        {note.content}
      </div>

      {/* Note metadata and actions */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          {note.updatedAt !== note.createdAt ? (
            <span>Updated {formatDate(note.updatedAt)}</span>
          ) : (
            <span>Created {formatDate(note.createdAt)}</span>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800"
            disabled={isDeleting}
            title="Edit note"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            disabled={isDeleting}
            title="Delete note"
          >
            {isDeleting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faTrash} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
