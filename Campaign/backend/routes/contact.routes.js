
import express from "express";
import upload from "../middleware/excelUpload.js";
import { uploadContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/upload-excel", upload.single("excel"), uploadContacts);

export default router;
