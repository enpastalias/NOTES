import mongoose from "mongoose";

// Define the schema (structure) for a Note in the database
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // A note must always have a title
  },
  content: {
    type: String,
    required: true, // A note must always have content
  },
});

// Create the model based on the schema and export it
// Models are fancy constructors compiled from Schema definitions.
// An instance of a model is called a document.
const Note = mongoose.model("Note", noteSchema);

export default Note;
