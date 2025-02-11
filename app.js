require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env);

// Apply security middleware
app.use(cors());
app.use(helmet());  // Adds security headers
app.use(bodyParser.json());

// Rate limiter (prevents brute-force attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later."
});
app.use(limiter);

// Create MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
    if (err) console.error('Database connection failed:', err);
    else console.log('✅ Connected to MySQL');
});

// Middleware for authentication
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided or incorrect format." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};


// 📌 API ROUTES

// 🔹 User Registration (without password)
app.post('/register', (req, res) => {
    const { name, email, department_id, role_id } = req.body;
    if (!name || !email || !department_id || !role_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = 'INSERT INTO users (name, email, department_id, role_id) VALUES (?, ?, ?, ?)';

    db.query(query, [name, email, department_id, role_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    });
});

// 🔹 User Login (Generate JWT Token)
app.post('/login', (req, res) => {
    const { email } = req.body; // No password required

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });

        res.json({ message: "Login successful", token });
    });
});

// 🔹 Get All Users (Protected Route)
app.get('/users', verifyToken, (req, res) => {
    const query = `
        SELECT users.id, users.name, users.email, departments.name AS department 
        FROM users 
        LEFT JOIN departments ON users.department_id = departments.id;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🔹 Delete a User (Admin Only - Protected)
app.delete('/users/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User deleted successfully" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Secure API running on http://localhost:${PORT}`);
});
