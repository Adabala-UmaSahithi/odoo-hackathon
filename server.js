import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@2805", // ⚠️ make sure this is correct
  database: "Money_tracker",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected to Money_tracker...");
});

// ✅ Register Route
app.post("/register", (req, res) => {
  const { firstName, lastName, email, pincode, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "SELECT username FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = {
        firstName,
        lastName,
        email,
        pincode,
        username,
        password: hashedPassword,
      };

      db.query("INSERT INTO users SET ?", user, (err) => {
        if (err) return res.status(500).json({ message: "Server error" });
        res.status(200).json({ message: "Registration successful" });
      });
    }
  );
});

// ✅ Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0) {
        return res.status(400).json({ message: "Username not found" });
      }

      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful" });
    }
  );
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
