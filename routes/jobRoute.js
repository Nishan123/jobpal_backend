const express = require('express')

const router = express.Router();

const jobController = require('../controllers/jobController')
const upload = require('../middleware/upload')

router.get('/jobs', jobController.getJobs);
router.get('/jobs/:id', jobController.getJobById);
router.post('/createJob', upload.single('company_logo'), jobController.createJob);
router.delete('/jobs/:id', jobController.deleteJob); 

module.exports = router;
