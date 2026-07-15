import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    // State to hold the list of all notes
    const [notes, setNotes] = useState([]);

    // State to handle form inputs (title, content)
    const [formData, setFormData] = useState({ title: "", content: "" });

    // State to track if we are editing an existing note
    const [editingId, setEditingId] = useState(null);

    // The base URL of our backend API
    const API_URL = `${VITE_API_URL}/notes`;

    // useEffect runs when the component first loads to fetch all notes
    useEffect(() => {
        fetchNotes();
    }, []);

    // Function to get all notes from the backend
    const fetchNotes = async () => {
        try {
            const response = await axios.get(API_URL);
            setNotes(response.data); // Update our notes state with data from the server
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    // Helper to handle typing in the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update the correct part of the form data state based on the input name
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle form submission (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Basic validation to make sure fields aren't empty
        if (!formData.title || !formData.content) return;

        try {
            if (editingId) {
                // If we are editing, send a PUT request to update the specific note
                await axios.put(`${API_URL}/${editingId}`, formData);
                setEditingId(null); // Clear editing mode
            } else {
                // If not editing, send a POST request to create a new note
                await axios.post(API_URL, formData);
            }

            // Reset the form fields and refresh the notes list
            setFormData({ title: "", content: "" });
            fetchNotes();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Function to handle when the 'Edit' button is clicked
    const handleEdit = (note) => {
        // Populate the form with the chosen note's data and set editing ID
        setFormData({ title: note.title, content: note.content });
        setEditingId(note._id);
    };

    // Function to handle deleting a note
    const handleDelete = async (id) => {
        try {
            // Send DELETE request to the backend for the specific note
            await axios.delete(`${API_URL}/${id}`);
            // Refresh the notes list to see the update
            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <div className="container">
            <h1>MERN Notes App</h1>

            <div className="card form-card">
                <h2>{editingId ? "Update Note" : "Add a New Note"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            placeholder="Note Title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="content"
                            placeholder="Note Content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows="4"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? "Update Note" : "Add Note"}
                    </button>
                </form>
            </div>

            <div className="notes-list">
                {notes.length === 0 ? (
                    <p className="no-notes">No notes yet. Start writing!</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className="card note-card">
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <div className="note-actions">
                                <button
                                    onClick={() => handleEdit(note)}
                                    className="btn btn-secondary"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
