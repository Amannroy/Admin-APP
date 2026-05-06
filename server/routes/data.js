import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import razorpay from "../razorpay.js";

const router = express.Router();

/* ================= STUDENTS ================= */

// Add student
router.post("/students", async (req, res) => {
  try {
    const { name, email, phone, class: studentClass } = req.body;

    const existing = await pool.query("SELECT * FROM students WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.json({ error: "Student already exists ❌" });
    }

    const result = await pool.query(
      "INSERT INTO students (name, email, phone, class) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, phone, studentClass],
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

// Add teacher
router.post("/teachers", async (req, res) => {
  try {
    const { name, email, password, subjects } = req.body;

    // 1️⃣ Check duplicate
    const existing = await pool.query("SELECT * FROM teachers WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.json({ error: "Teacher already exists ❌" });
    }

    // 2️⃣ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Convert subjects array → string
    const subjectsString = JSON.stringify(subjects);

    // 4️⃣ Insert into DB
    const result = await pool.query(
      "INSERT INTO teachers (name, email, password, subjects) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, hashedPassword, subjectsString],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("TEACHER ERROR:", err);
    res.status(500).json({ error: "Error adding teacher" });
  }
});

// ================= PAYMENT =================

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 100,
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.log("RAZORPAY ERROR:", err);
    res.status(500).json({
      error: "Failed to create order",
    });
  }
});

/* ================= FEES ================= */

// Mark fee paid
router.post("/fees", async (req, res) => {
  try {
    const { student_id, month, paid } = req.body;

    const existing = await pool.query(
      "SELECT * FROM fees WHERE student_id=$1 AND month=$2",
      [student_id, month],
    );

    if (existing.rows.length > 0) {
      return res.json({ error: "Fees already marked ❌" });
    }

    await pool.query(
      "INSERT INTO fees (student_id, month, paid) VALUES ($1,$2,$3)",
      [student_id, month, paid],
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

// ================= WEBHOOK =================
//  This route acts like a receiver. Razorpay -> /razprpay-webhook-> Backend receives payment event -> Save payment in DB
router.post("/razorpay-webhook", async (req, res) => {
  try {
    console.log("WEBHOOK RECEIVED");

    console.log(req.body);

    await pool.query(
      "INSERT INTO payments (razorpay_payment_id, amount, status) VALUES ($1,$2,$3)",
      [
        "test_payment_123",
        100,
        "captured"
      ]
    );

    res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Webhook failed",
    });
  }
});

export default router;
