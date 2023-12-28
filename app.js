// index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const vectorUtils = require('./public/js/vectorUtils'); // Adjust the path accordingly
const pdfParse = require('pdf-parse');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get Routes
app.get(['/', '/index.html', '/ragtag'], (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// Post Routes
app.post('/upload', upload.single('fileInput'), async (req, res) => {
  try {
    let fileText;

    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      const pdfText = pdfData.text;
      fileText = pdfText;
    } else if (req.file.mimetype === 'text/plain') {
      const text = req.file.buffer.toString('utf-8');
      fileText = text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    const result = await vectorUtils.processAndStoreVector(fileText);
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error during file processing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for handling user text input and retrieving vectors from the database
app.post('/get-vectors', async (req, res) => {
  try {
    const userInput = req.body.textInput;
    const vectorResult = await vectorUtils.getUserPromptVector(userInput);
    const vectorString = JSON.stringify(vectorResult);

    const similarStringsResult = await vectorUtils.getSimilarVectors(vectorString)

    if (similarStringsResult) {
      res.status(200).json(similarStringsResult);
    } else {
      res.status(404).send('No vectors found for the given text input.');
    }
  } catch (error) {
    console.error('Error retrieving vectors from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

db.once('open', () => {
    console.log('Connected to MongoDB');
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  });