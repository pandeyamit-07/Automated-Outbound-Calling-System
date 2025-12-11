// // controllers/audio.controller.js
// const path = require('path');
// const multer = require('multer');
// const fs = require('fs');
// const mm = require('music-metadata');
// const Audio = require('../models/audio.model');
// const { getExtension } = require('../utils/fileFilter');

// const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

// // multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // unique filename: timestamp-original
//     const ext = getExtension(file.originalname);
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, unique + ext);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (adjust)
//   fileFilter: require('../utils/fileFilter').fileFilter
// }).single('file');

// async function uploadAudio(req, res) {
//   // multer handles multipart; wrap in promise
//   upload(req, res, async function (err) {
//     if (err) {
//       return res.status(400).json({ error: true, message: err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: true, message: 'Audio file is required as "file" field.' });
//     }

//     try {
//       const providedName = req.body.name || null;
//       // read duration using music-metadata
//       const filePath = path.join(uploadDir, req.file.filename);

//       let durationSeconds = null;
//       try {
//         const metadata = await mm.parseFile(filePath);
//         if (metadata && metadata.format && metadata.format.duration) {
//           durationSeconds = metadata.format.duration; // seconds (float)
//         }
//       } catch (metaErr) {
//         console.warn('Could not read metadata for duration:', metaErr.message);
//         // don't fail — duration can be null
//       }

//       const dbRecord = await Audio.create({
//         name: providedName || req.file.originalname,
//         original_filename: req.file.originalname,
//         file_path: `/uploads/${req.file.filename}`, // relative url
//         duration_seconds: durationSeconds
//       });

//       return res.status(201).json({
//         error: false,
//         message: 'Audio uploaded and saved successfully',
//         data: dbRecord
//       });
//     } catch (e) {
//       console.error('Error saving audio:', e);
//       // try to remove uploaded file on error
//       try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (er) {}
//       return res.status(500).json({ error: true, message: 'Server error' });
//     }
//   });
// }

// async function listAudios(req, res) {
//   try {
//     const rows = await Audio.findAll();
//     return res.json({ error: false, data: rows });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: true, message: 'Server error' });
//   }
// }

// async function getAudioById(req, res) {
//   try {
//     const id = parseInt(req.params.id);
//     if (!id) return res.status(400).json({ error: true, message: 'Invalid id' });
//     const row = await Audio.findById(id);
//     if (!row) return res.status(404).json({ error: true, message: 'Not found' });
//     return res.json({ error: false, data: row });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: true, message: 'Server error' });
//   }
// }

// module.exports = {
//   uploadAudio,
//   listAudios,
//   getAudioById
// };



import path from "path";
import fs from "fs";
import multer from "multer";
import * as mm from "music-metadata";
import { pool } from "../config/db.js";  // 🔥 MySQL pool import

// Upload directory
const uploadDir = path.resolve("uploads/audios");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ----------------------------------------------
   MULTER STORAGE
------------------------------------------------ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage }).single("file");

/* ----------------------------------------------
   CONTROLLER: UPLOAD AUDIO
------------------------------------------------ */
export const uploadAudio = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: true, message: err.message });

    if (!req.file)
      return res.status(400).json({ error: true, message: "Audio file missing" });

    try {
      const name = req.body.name || req.file.originalname;
      const filePath = `/uploads/audios/${req.file.filename}`;

      // 📌 Read duration
      let durationSeconds = null;
      try {
        const metadata = await mm.parseFile(path.join(uploadDir, req.file.filename));
        durationSeconds = metadata?.format?.duration || null;
      } catch (e) {
        console.log("Metadata error", e.message);
      }

      // 📌 Insert into DB
      const [result] = await pool.query(
        `INSERT INTO audios (name, file_path, duration_seconds) VALUES (?, ?, ?)`,
        [name, filePath, durationSeconds]
      );

      res.status(201).json({
        error: false,
        message: "Audio uploaded",
        data: {
          id: result.insertId,
          name,
          file_path: filePath,
          duration_seconds: durationSeconds,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: true, message: "Server Error" });
    }
  });
};

/* ----------------------------------------------
   CONTROLLER: LIST ALL AUDIOS
------------------------------------------------ */
export const listAudios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM audios ORDER BY id DESC");
    res.json({ error: false, data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: "Server error" });
  }
};

/* ----------------------------------------------
   CONTROLLER: GET AUDIO BY ID
------------------------------------------------ */
export const getAudioById = async (req, res) => {
  try {
    const audioId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM audios WHERE id = ?", [
      audioId,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ error: true, message: "Not found" });

    res.json({ error: false, data: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: "Server error" });
  }
};
