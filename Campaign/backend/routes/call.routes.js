
import express from "express";
import { startCalls, postDtmf } from "../controllers/call.controller.js";
import { protect } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/start-calls", protect, startCalls);
router.post("/dtmf", postDtmf); // can be open or protected – as you wish

export default router;
