const express = require('express')

const router = express.Router();

const jobController = require('../controllers/jobController')

router.get('/jobs', jobController.getJobs);
router.get('/jobs/:id', jobController.getJobById);
router.post('/createJob', jobController.createJob);
router.delete('/jobs/:id', jobController.deleteJob); 

module.exports = router;
