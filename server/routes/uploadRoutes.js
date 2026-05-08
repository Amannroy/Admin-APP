import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import pool from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

// BULK STUDENT UPLOAD
router.post(
    "/upload-students",
    upload.single("file"),
    async (req, res) => {
        const results = [];

        fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => {
            results.push(data);
        })
        .on("end", async() => {
            try{
                for (const student of results){
                    await pool.query(
                        `INSERT INTO students (name, email, phone, class)
                        VALUES ($1,$2,$3,$4)`,
                        [
                            student.name,
                            student.email,
                            student.phone,
                            student.class,
                        ]
                    );
                }

                fs.unlinkSync(req.file.path);

                res.json({
                    success: true,
                    connt: results.length,
                });
            }catch(err){
                console.log(err);

                res.status(500).json({
                    error: "Bulk upload failed",
                })
                
            }
        })
    }
);



router.post(
  "/upload-teachers",
  upload.single("file"),
  async (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {

          for (const teacher of results) {

            // hash password
            const hashedPassword = await bcrypt.hash(
              teacher.password,
              10
            );

            await pool.query(
              `INSERT INTO teachers
              (name, email, password, subjects)
              VALUES ($1,$2,$3,$4)`,

              [
                teacher.name,
                teacher.email,
                hashedPassword,
                JSON.stringify([teacher.subjects]),
              ]
            );
          }

          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            count: results.length,
          });

        } catch (err) {

          console.log(err);

          res.status(500).json({
            error: "Teacher bulk upload failed",
          });
        }
      });
  }
);

export default router;