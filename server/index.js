import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";

// load env variables
dotenv.config();

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());


// Routes
app.use("/", authRoutes);
app.use("/api", dataRoutes);

console.log("DB:", process.env.DB_URL);

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    
})
