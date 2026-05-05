import express from "express";
import pool from "../db.js";


const router = express.Router();

// Add student
router.post("/students", async(req, res) => {
    const {name, email, phone, course} = req.body;

    try{
        
        const result = await pool.query(
            "INSERT INTO students (name, email, phone, course) VALUES ($1,$2,$3,$4) RETURNING *",
            [name, email, phone, course]
        );
    
        res.json(result.rows[0]);

    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error adding student"});
    }
});

// Get all students
router.get("/students", async(req, res) => {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
})

// Add teacher
router.post("/teachers", async(req, res) => {
    const {name, email, phone, subject} = req.body;

    const result = await pool.query(
        "INSERT INTO teachers (name, email, phone, subject) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, email, phone, subject] 
    );
    res.json(result.rows[0]);
})

// Mark fee paid
router.post("/fees", async(req, res) => {
    const {student_id, month, paid} = req.body;

    const result = await pool.query(
        "INSERT INTO fees (student_id, month, paid) VALUES ($1,$2,$3)",
        [student_id, month, paid]
    );
    res.json({success: true});
})

export default router;