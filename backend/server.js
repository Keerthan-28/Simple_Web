const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "mysecretkey"; // later move to .env

app.use(cors());
app.use(bodyParser.json());

// In-memory DB
let users = [];
let students = [];
let studentId = 1;
let userId = 1;

/* ---------------- REGISTER ---------------- */
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        id: userId++,
        email,
        password: hashedPassword
    });

    res.json({ message: "User registered successfully" });
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

/* ---------------- AUTH MIDDLEWARE ---------------- */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

/* ---------------- PROTECTED STUDENT APIs ---------------- */
app.get("/students", authenticateToken, (req, res) => {
    res.json(students);
});

app.post("/students", authenticateToken, (req, res) => {
    const student = {
        id: studentId++,
        name: req.body.name,
        email: req.body.email
    };
    students.push(student);
    res.json(student);
});

app.put("/students/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    student.name = req.body.name;
    student.email = req.body.email;

    res.json({ message: "Student updated" });
});

app.delete("/students/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.json({ message: "Student deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
