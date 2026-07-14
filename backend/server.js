import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Note from "./models/Note.js";

// Load environment variables from our .env file so we can use them safely
dotenv.config();

const app = express();

// Middleware
// cors() allows our React frontend to request data from this backend without security errors.
app.use(cors());
// express.json() converts incoming request bodies (which are in JSON format) into JavaScript objects.
app.use(express.json());

// Connect to MongoDB
// We use an async function immediately invoked to handle the connection
const connectDB = async () => {
    try {
        // Process.env accesses the variables defined in .env
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// --- REST APIs for Notes ---

// GET /notes
// Purpose: Return all notes from the database.
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find(); // Find all documents in the "notes" collection
        res.status(200).json(notes);
    } catch (error) {
        // If an error happens, return it to the client with a 500 status code
        res.status(500).json({ message: error.message });
    }
});

// POST /notes
// Purpose: Create a new note and save it to the database.
app.post("/notes", async (req, res) => {
    try {
        // Extract title and content from the incoming JSON body
        const { title, content } = req.body;

        // Create a new Note instance with the extracted data
        const newNote = new Note({ title, content });

        // Save the new note to the database
        const savedNote = await newNote.save();

        // Return the newly saved note with a 201 (Created) status code
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /notes/:id
// Purpose: Update an existing note by its unique ID.
app.put("/notes/:id", async (req, res) => {
    try {
        // req.params.id gets the :id part from the URL
        const { id } = req.params;
        const { title, content } = req.body;

        // Find the note by ID and update its fields
        // The { new: true } option returns the updated document instead of the old one
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /notes/:id
// Purpose: Delete a specific note by its unique ID.
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find and remove the note
        await Note.findByIdAndDelete(id);

        // Return a simple success message
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
