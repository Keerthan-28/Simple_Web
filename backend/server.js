const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory database
let students = [];
let idCounter = 1;

/* ------------------ GET ALL STUDENTS ------------------ */
app.get("/students", (req, res) => {
    res.json(students);
});

/* ------------------ ADD STUDENT ------------------ */
app.post("/students", (req, res) => {
    const student = {
        id: idCounter++,
        name: req.body.name,
        email: req.body.email
    };
    students.push(student);
    res.json({ message: "Student added", student });
});

/* ------------------ UPDATE STUDENT ------------------ */
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    student.name = req.body.name;
    student.email = req.body.email;

    res.json({ message: "Student updated", student });
});

/* ------------------ DELETE STUDENT ------------------ */
app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.json({ message: "Student deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
