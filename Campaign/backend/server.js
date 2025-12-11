
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import groupRoutes from "./routes/group.routes.js";
import authRoutes from "./routes/auth.route.js";
import audioRoutes from "./routes/audio.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import callRoutes from "./routes/call.routes.js";
import { testDB, ensureUploadDir } from "./config/db.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
testDB();

// Prepare upload folder
ensureUploadDir();
// static for uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/call", callRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/dashboard-stats", dashboardRoutes);


const PORT = process.env.PORT || 5400;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
