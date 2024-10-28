import { useEffect, useState } from 'react';
import { BASE_API_URL } from '../constants';

const useNotePageLogic = () => {
  const [notes, setNotes] = useState([]); // State to store notes from the API
  const [newNote, setNewNote] = useState({ title: '', description: '' }); // State for creating a new note
  const [editNote, setEditNote] = useState(null); // State to store the note being edited

  // Function to fetch notes from the API
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/NoteApp/notes`); // API call to fetch notes
      if (!response.ok) throw new Error('Failed to fetch notes'); // Error handling
      const data = await response.json(); // Parse response as JSON
      setNotes(data); // Set fetched notes to state
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  // Function to add a new note
  const createNote = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(`${BASE_API_URL}/api/NoteApp/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote), // Sending the new note data
      });

      if (!response.ok) {
        throw new Error('Error: Failed to create note'); // Error handling
      }

      const createdNote = await response.json(); // Get the created note from the response
      setNotes((prevNotes) => [...prevNotes, createdNote]); // Update state to include the new note
      setNewNote({ title: '', description: '' }); // Reset the new note state
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  // Function to delete a note by ID
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/NoteApp/notes/${id}/`, {
        method: 'DELETE', // Delete request
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get error response body
        throw new Error(`Failed to delete note: ${errorDetails}`); // Log detailed error
      }

      // Update state to remove deleted note
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  // Function to update an existing note
  const updateNote = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(`${BASE_API_URL}/api/NoteApp/notes/${editNote.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editNote), // Sending the updated note data
      });
      if (!response.ok) {
        throw new Error('Error updating the note'); // Error handling
      }
      const updatedNote = await response.json(); // Get the updated note from the response
      setNotes((prevNotes) => prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))); // Update state with the edited note
      setEditNote(null); // Reset the edit state
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes(); // Call fetchNotes function on mount
  }, []);

  return {
    notes,
    newNote,
    setNewNote,
    editNote,
    setEditNote,
    createNote,
    deleteNote,
    updateNote,
  };
};

export default useNotePageLogic; // Export as default
