import express from "express";
import pool from "../db.js";

const router = express.Router();

/* ================= STUDENTS ================= */

// Add student
router.post("/students", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const existing = await pool.query(
      "SELECT * FROM students WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.json({ error: "Student already exists ❌" });
    }

    const result = await pool.query(
      "INSERT INTO students (name, email, phone) VALUES ($1,$2,$3) RETURNING *",
      [name, email, phone]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding student" });
  }
});

// Get all students
router.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching students" });
  }
});


/* ================= TEACHERS ================= */

router.post("/teachers", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM teachers WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.json({ error: "Teacher already exists ❌" });
    }

    const result = await pool.query(
      "INSERT INTO teachers (name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding teacher" });
  }
});


/* ================= FEES ================= */

// Mark fee paid
router.post("/fees", async (req, res) => {
  try {
    const { student_id, month, paid } = req.body;

    const existing = await pool.query(
      "SELECT * FROM fees WHERE student_id=$1 AND month=$2",
      [student_id, month]
    );

    if (existing.rows.length > 0) {
      return res.json({ error: "Fees already marked ❌" });
    }

    await pool.query(
      "INSERT INTO fees (student_id, month, paid) VALUES ($1,$2,$3)",
      [student_id, month, paid]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error marking fees" });
  }
});

// Get all fees
router.get("/fees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM fees");
    res.json(result.rows);
  } catch (err) {
    console.error("FEES ERROR:", err);
    res.status(500).json({ error: "Error fetching fees" });
  }
});

export default router;