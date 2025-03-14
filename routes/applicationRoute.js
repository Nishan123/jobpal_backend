const express = require('express');
const router = express.Router();
const { submitApplication, getJobApplications, updateApplicationStatus, getMyApplications } = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/auth'); // Assuming you have auth middleware

// Submit a job application (requires authentication)
router.post('/applications', verifyToken, submitApplication);

// Get applications for a specific job (only accessible by job poster)
router.get('/applications/job/:jobId', verifyToken, getJobApplications);

// Update application status (only accessible by job poster)
router.put('/applications/:applicationId/status', verifyToken, updateApplicationStatus);

// Get applications for the logged-in user
router.get('/applications/my-applications', verifyToken, getMyApplications);

module.exports = router;
