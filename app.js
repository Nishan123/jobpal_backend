const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files for images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Make sure the uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files from the uploads directory (only one instance)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 