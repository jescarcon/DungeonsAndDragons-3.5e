// NotePage.js
import React from 'react';
import './NotePage.css'; // Import CSS file for styling
import useNotePageLogic from './NotePageLogic'; // Import the custom hook

export default function NotePage() {
  const {
    notes,
    newNote,
    setNewNote,
    editNote,
    setEditNote,
    createNote,
    deleteNote,
    updateNote,
  } = useNotePageLogic(); // Use the logic hook

  return (
    <div className="note-page">
      <h1>Notes</h1>

      {/* Form to add a new note */}
      <form onSubmit={createNote} className="new-note-form">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} // Update title of new note
          required
          maxLength={50}
        />
        <textarea
          placeholder="Description"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })} // Update description of new note
          required
          maxLength={200}
        ></textarea>
        <button type="submit">Add Note</button>
      </form>

      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {editNote && editNote.id === note.id ? (
              <form onSubmit={updateNote} className="edit-note-form">
                <input
                  type="text"
                  value={editNote.title}
                  onChange={(e) => setEditNote({ ...editNote, title: e.target.value })} // Update title of the note being edited
                  placeholder="Edit title"
                  required
                  maxLength={50}
                />
                <textarea
                  value={editNote.description}
                  onChange={(e) => setEditNote({ ...editNote, description: e.target.value })} // Update description of the note being edited
                  placeholder="Edit description"
                  required
                  maxLength={200}
                ></textarea>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditNote(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {/* Displaying note information */}
                <div className="note-card-title">
                  {note.title}
                  <button onClick={() => deleteNote(note.id)} className="delete-button">X</button> {/* Delete button */}
                </div>
                <p>{note.description}</p>
                <button className="edit-button" onClick={() => setEditNote(note)}>Edit</button> {/* Edit button */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
