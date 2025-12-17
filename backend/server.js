const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary Database (Array)
let students = [];

// API 1: Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

// API 2: Add a student
app.post("/students", (req, res) => {
    const student = req.body;
    students.push(student);
    res.json({ message: "Student added successfully!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
