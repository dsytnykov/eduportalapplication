import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useNotes from "../../hooks/useNotes";

const NoteEditor = ({
  contentfulEntryId,
  initialContent = "",
  noteId = null,
  onCancel = null,
}) => {
  const [content, setContent] = useState(initialContent);
  const { addNote, editNote, loading } = useNotes();
  const [error, setError] = useState(null);

  const isEditing = !!noteId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Note content cannot be empty");
      return;
    }

    setError(null);

    try {
      if (isEditing) {
        await editNote(noteId, content);
        if (onCancel) onCancel();
      } else {
        await addNote(contentfulEntryId, content);
        setContent("");
      }
    } catch (err) {
      setError("Failed to save note. Please try again.");
      console.error("Error saving note:", err);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200">
      <form onSubmit={handleSubmit}>
        {/* Editor header */}
        <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 rounded-t-md">
          <h3 className="text-sm font-medium text-gray-700">
            {isEditing ? "Edit Note" : "Add a New Note"}
          </h3>
        </div>

        {/* Textarea */}
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full border border-gray-300 rounded p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Actions */}
        <div className="px-4 py-3 bg-gray-50 text-right rounded-b-md flex justify-end space-x-2">
          {isEditing && onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;
