// utils/fileFilter.js
const path = require('path');

const audioMimeTypes = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/x-m4a',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/webm'
];

function fileFilter(req, file, cb) {
  if (audioMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
}

function getExtension(originalName) {
  return path.extname(originalName) || '';
}

module.exports = { fileFilter, getExtension };
