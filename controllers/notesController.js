const Note = require("../models/noteModel");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (token) => {
  const decoded = jwt.verify(token, "alokmishra");
  return decoded.id;
};
exports.createNote = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = getUserIdFromToken(
      String(req.headers.authorization).split(" ")[1]
    );

    const newNote = new Note({
      userId,
      content,
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json('Something went wrong');
  }
};

exports.readNote = async (req, res) => {
  try{
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);
  
    const notes = await Note.find({ userId });
  
    res.status(200).json(notes);
  }catch (err) {
    console.error(err);
    res.status(500).json('Something went wrong');
  }
};

exports.updateNote = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);
    const { content } = req.body;
    const { id } = req.params;
    
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { content },
      { new: true }
    );
    
    if (!note) res.status(404).json({ message: "Note not found" });
    
    res.status(200).json(note);
  }catch (err) {
    console.error(err);
    res.status(500).json('Something went wrong');
  }
};

exports.deleteNote = async (req, res) => {
  try{
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);
    const { id } = req.params;
  
    const note = await Note.findOneAndDelete({ _id: id, userId });
  
    if (!note) res.status(404).json({ message: "Note not found" });
  
    res.status(200).json({ message: "Note deleted successfully" });
  }catch (err) {
    console.error(err);
    res.status(500).json('Something went wrong');
  }
};
