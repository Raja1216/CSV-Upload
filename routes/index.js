const express = require("express");
const router = express.Router();
const multer = require("multer");
const CsvModel = require("../models/csvModel");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Index route
router.get('/', async (req, res) => {
  // Fetch all uploaded files
  const files = await CsvModel.find();
  res.render('index', { files, selectedFile: null });
});

// File upload route
router.post('/upload', upload.single('csvFile'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Parse CSV and save to MongoDB
  const data = [];
  file.buffer.toString().split('\n').forEach(row => {
    if (row.trim() !== '') {
      data.push(row.split(','));
    }
  });

  const csvData = new CsvModel({
    filename: file.originalname,
    data: data,
  });

  await csvData.save();

  res.redirect('/');
});

module.exports = router;
