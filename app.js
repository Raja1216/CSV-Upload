const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csvParser = require('csv-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/csvUploader', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Import routes
const indexRoutes = require('./routes/index');
const CsvModel = require('./models/csvModel');
app.use('/', indexRoutes);

// Add a new route to handle file viewing
app.get('/file/:filename', async (req, res) => {
  const filename = req.params.filename;

  try {
    const selectedFile = await CsvModel.findOne({ filename });

    if (!selectedFile) {
      return res.status(404).send('File not found');
    }

    res.render('index', { files: [], selectedFile });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
