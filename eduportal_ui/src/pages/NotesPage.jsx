import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSearch } from "@fortawesome/free-solid-svg-icons";
import useNotes from "../hooks/useNotes";
import NoteItem from "../components/notes/NoteItem";
import Loader from "../components/common/Loader";

const NotesPage = () => {
  const { notes, loading, error, loadUserNotes } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    loadUserNotes();
  }, [loadUserNotes]);

  useEffect(() => {
    if (!notes) return;

    const filtered = notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  const groupNotesByEntry = () => {
    const grouped = {};

    filteredNotes.forEach((note) => {
      const { contentfulEntryId } = note;

      if (!grouped[contentfulEntryId]) {
        grouped[contentfulEntryId] = [];
      }

      grouped[contentfulEntryId].push(note);
    });

    return grouped;
  };

  const groupedNotes = groupNotesByEntry();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>

      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            placeholder="Search your notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Notes content */}
      {loading ? (
        <Loader text="Loading your notes..." />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No notes found matching your search."
              : "You haven't created any notes yet."}
          </p>

          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          ) : (
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(
            ([contentfulEntryId, entryNotes]) => (
              <div
                key={contentfulEntryId}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Entry header - could show course/lesson title if available */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faBook} />
                  </div>

                  <div>
                    <h2 className="text-lg font-medium">
                      Notes for Content #{contentfulEntryId.slice(0, 8)}...
                    </h2>
                    <p className="text-sm text-gray-600">
                      {entryNotes.length} note
                      {entryNotes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Entry notes */}
                <div className="divide-y divide-gray-200">
                  {entryNotes.map((note) => (
                    <div key={note.id} className="p-6">
                      <NoteItem note={note} />
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
