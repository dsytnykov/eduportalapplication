import api from "./api";

const notesCache = new Map();
const CACHE_EXPIRY = 60000;

/**
 * Fetch all notes for the current user
 * @returns {Promise<Array>} List of notes
 */
export const fetchUserNotes = async () => {
  const cacheKey = "all-notes";
  const now = Date.now();

  if (notesCache.has(cacheKey)) {
    const cachedData = notesCache.get(cacheKey);
    if (now - cachedData.timestamp < CACHE_EXPIRY) {
      console.log("Using cached notes");
      return cachedData.data;
    }
  }

  console.log("Fetching all user notes");
  try {
    const response = await api.get("/notes");

    notesCache.set(cacheKey, {
      data: response.data,
      timestamp: now,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user notes:", error);
    throw error;
  }
};

/**
 * Fetch notes for a specific content entry
 * @param {string} contentfulEntryId - The Contentful entry ID
 * @returns {Promise<Array>} List of notes for the content
 */
export const fetchContentNotes = async (contentfulEntryId) => {
  const cacheKey = `notes-${contentfulEntryId}`;
  const now = Date.now();

  if (notesCache.has(cacheKey)) {
    const cachedData = notesCache.get(cacheKey);
    if (now - cachedData.timestamp < CACHE_EXPIRY) {
      console.log(`Using cached notes for ${contentfulEntryId}`);
      return cachedData.data;
    }
  }

  console.log(`Fetching notes for content ${contentfulEntryId}`);
  try {
    const response = await api.get(`/notes/entry/${contentfulEntryId}`);

    notesCache.set(cacheKey, {
      data: response.data,
      timestamp: now,
    });

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching notes for content ${contentfulEntryId}:`,
      error
    );
    throw error;
  }
};

/**
 * Create a new note
 * @param {string} contentfulEntryId - The Contentful entry ID
 * @param {string} content - The note content
 * @returns {Promise<Object>} The created note
 */
export const createNote = async (contentfulEntryId, content) => {
  console.log(`Creating note for content ${contentfulEntryId}`);
  try {
    const response = await api.post("/notes", {
      contentfulEntryId,
      content,
    });

    notesCache.delete("all-notes");
    notesCache.delete(`notes-${contentfulEntryId}`);

    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

/**
 * Update an existing note
 * @param {string} noteId - The ID of the note to update
 * @param {string} content - The new note content
 * @returns {Promise<Object>} The updated note
 */
export const updateNote = async (noteId, content) => {
  console.log(`Updating note ${noteId}`);
  try {
    const response = await api.put(`/notes/${noteId}`, {
      content,
    });

    for (const key of notesCache.keys()) {
      notesCache.delete(key);
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Delete a note
 * @param {string} noteId - The ID of the note to delete
 * @returns {Promise<void>}
 */
export const deleteNote = async (noteId) => {
  console.log(`Deleting note ${noteId}`);
  try {
    await api.delete(`/notes/${noteId}`);

    for (const key of notesCache.keys()) {
      notesCache.delete(key);
    }
  } catch (error) {
    console.error(`Error deleting note ${noteId}:`, error);
    throw error;
  }
};
