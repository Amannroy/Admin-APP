import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

// load env variables
dotenv.config();

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());


// Routes
app.use("/", authRoutes);

console.log("DB:", process.env.DB_URL);

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    
})
