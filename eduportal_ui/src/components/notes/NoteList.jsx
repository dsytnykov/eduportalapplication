import React from "react";
import NoteItem from "./NoteItem";

const NoteList = ({ notes = [] }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No notes yet. Add your first note above!
      </div>
    );
  }

  const sortedNotes = [...notes].sort((a, b) => {
    return (
      new Date(b.updatedAt || b.createdAt) -
      new Date(a.updatedAt || a.createdAt)
    );
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Your Notes</h3>

      <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
        {sortedNotes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
