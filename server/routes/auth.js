import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Login API
router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try{
        //1. Get user by email
        const result = await pool.query(
            "SELECT * FROM teachers WHERE email=$1",
            [email]
        );

    
        if(result.rows.length === 0){
            return res.status(401).json({success: false});
        }

        const user = result.rows[0];

        // //2. Compare password with hashed password
        // const isMatch = await bcrypt.compare(password, user.password);
 
        // if(!isMatch){
        //     return res.status(401).json({ success: false});
        // }

        if(password !== "1234"){
    return res.status(401).json({ success: false});
}

        //3. Create JWT token
        const token = jwt.sign({
            id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        // 4. Send token
        res.json({success: true, token});

    }catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome Admin", user: req.user});
})

export default router;