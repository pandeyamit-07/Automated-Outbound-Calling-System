
import express from "express";
import { uploadAudio, listAudios, getAudioById } from "../controllers/audio.controller.js";
import { protect } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/upload", protect, uploadAudio);
router.get("/", protect, listAudios);
router.get("/:id", protect, getAudioById);

export default router;

