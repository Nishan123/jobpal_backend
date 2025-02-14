//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');

// Import models in correct order
const User = require('./model/User');
const Job = require('./model/Job');
const Application = require('./model/Application');

const userRoute = require('./routes/userRoute')
const jobRoute = require('./routes/jobRoute')
const applicationRoute = require('./routes/applicationRoute')

//Creating a Server
const app = express();

//Creating a port
const PORT = process.env.PORT || 5000

//Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Fix: Mount routes with correct paths
app.use('/', userRoute);
app.use('/', jobRoute);
app.use('/', applicationRoute);

// Sync database models
sequelize.sync({ force: false }) // Don't force recreate tables to preserve data
  .then(() => {
    console.log('Database tables synchronized');
    app.listen(PORT, () => {
      console.log(`Server Running on PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
