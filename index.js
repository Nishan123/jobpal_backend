//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute')
const jobRoute = require('./routes/jobRoute')

//Creating a Server
const app = express();

//Creating a port
const PORT = process.env.PORT || 5000

//Creating a middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For handling large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Fix: Mount routes with correct paths
app.use('/', userRoute);
app.use('/', jobRoute); 

// Sync database models
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
