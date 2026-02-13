const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create DB
const db = new sqlite3.Database("./notes.db");
const PORT = process.env.PORT || 5000;
// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  )
`);

// GET all notes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    res.json(rows);
  });
});

// ADD note
app.post("/notes", (req, res) => {
  const { message } = req.body;
  db.run("INSERT INTO notes (message) VALUES (?)", [message], function (err) {
    res.json({ id: this.lastID });
  });
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", [req.params.id], function (err) {
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});