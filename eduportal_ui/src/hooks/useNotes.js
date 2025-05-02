import { useState, useEffect, useCallback, useContext } from "react";
import {
  fetchUserNotes,
  fetchContentNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { AuthContext } from "../contexts/AuthContext";

const useNotes = () => {
  const { currentUser } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [contentNotes, setContentNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchedContentIds = new Set();

  useEffect(() => {
    if (currentUser) {
      loadUserNotes();
    } else {
      setNotes([]);
      setContentNotes({});
      fetchedContentIds.clear();
    }
  }, [currentUser]);

  const loadUserNotes = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const notesData = await fetchUserNotes();
      setNotes(notesData);

      const notesByContent = notesData.reduce((acc, note) => {
        const { contentfulEntryId } = note;
        if (!acc[contentfulEntryId]) {
          acc[contentfulEntryId] = [];
        }
        acc[contentfulEntryId].push(note);
        return acc;
      }, {});

      setContentNotes(notesByContent);
    } catch (error) {
      console.error("Error loading notes:", error);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const loadContentNotes = useCallback(
    async (contentfulEntryId) => {
      if (!currentUser || !contentfulEntryId) return;

      if (fetchedContentIds.has(contentfulEntryId)) {
        console.log(`Notes for ${contentfulEntryId} already loaded`);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const notesData = await fetchContentNotes(contentfulEntryId);

        fetchedContentIds.add(contentfulEntryId);

        setContentNotes((prev) => ({
          ...prev,
          [contentfulEntryId]: notesData,
        }));

        setNotes((prev) => {
          const filtered = prev.filter(
            (note) => note.contentfulEntryId !== contentfulEntryId
          );
          return [...filtered, ...notesData];
        });

        return notesData;
      } catch (error) {
        console.error("Error loading content notes:", error);
        setError("Failed to load notes for this content. Please try again.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const addNote = useCallback(
    async (contentfulEntryId, content) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const newNote = await createNote(contentfulEntryId, content);

        setNotes((prev) => [...prev, newNote]);
        setContentNotes((prev) => ({
          ...prev,
          [contentfulEntryId]: [...(prev[contentfulEntryId] || []), newNote],
        }));

        return newNote;
      } catch (error) {
        console.error("Error creating note:", error);
        setError("Failed to create note. Please try again.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const editNote = useCallback(
    async (noteId, content) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const updatedNote = await updateNote(noteId, content);

        setNotes((prev) =>
          prev.map((note) => (note.id === noteId ? updatedNote : note))
        );

        setContentNotes((prev) => {
          const entryId = updatedNote.contentfulEntryId;
          if (prev[entryId]) {
            return {
              ...prev,
              [entryId]: prev[entryId].map((note) =>
                note.id === noteId ? updatedNote : note
              ),
            };
          }
          return prev;
        });

        return updatedNote;
      } catch (error) {
        console.error("Error updating note:", error);
        setError("Failed to update note. Please try again.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const removeNote = useCallback(
    async (noteId) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const noteToRemove = notes.find((note) => note.id === noteId);

        await deleteNote(noteId);

        setNotes((prev) => prev.filter((note) => note.id !== noteId));

        if (noteToRemove) {
          const entryId = noteToRemove.contentfulEntryId;
          setContentNotes((prev) => {
            if (prev[entryId]) {
              return {
                ...prev,
                [entryId]: prev[entryId].filter((note) => note.id !== noteId),
              };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        setError("Failed to delete note. Please try again.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, notes]
  );

  return {
    notes,
    contentNotes,
    loading,
    error,
    loadUserNotes,
    loadContentNotes,
    addNote,
    editNote,
    removeNote,
  };
};

export default useNotes;
