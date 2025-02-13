const express = require('express');
const cors = require('cors');
const path = require('path');
const upload = require('./config/multerConfig');
const jobController = require('./controllers/jobController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.post('/createJob', upload.single('company_logo'), jobController.createJob);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});