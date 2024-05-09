const express = require("express");
const router = express.Router();
const noteController = require("../controllers/notesController");

router.post("/create", noteController.createNote);
router.get("/read", noteController.readNote);
router.put("/update/:id", noteController.updateNote);
router.delete("/delete/:id", noteController.deleteNote);

module.exports = router;
