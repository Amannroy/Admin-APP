import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";

// load env variables
dotenv.config({ path: "./.env" });

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());


// API Routes
app.use("/", authRoutes);
app.use("/api", dataRoutes);

//  ================= FRONTEND SETUP =================

// Needed because __dirname does not work in ES Modules
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Path to React dist folder
const frontendPath = path.join(__dirname, "../client/dist");

// Server Frontend static files
app.use(express.static(frontendPath));

// React fallback route
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
})

console.log("DB:", process.env.DATABASE_URL);


// ================= SERVER =================

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    
})
