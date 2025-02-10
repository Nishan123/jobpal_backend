const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.post('/createJob', async (req, res) => {
  try {
    console.log('Received job data:', req.body); // Debug log

    const newJob = await Job.create({
      company_name: req.body.company_name,
      job_location: req.body.job_location,
      company_logo: req.body.company_logo,
      position: req.body.position,
      description: req.body.description,
      experience: req.body.experience,
      salary: req.body.salary
    });

    console.log('Job created:', newJob); // Debug log
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error); // Debug log
    res.status(500).json({
      message: 'Failed to create job',
      error: error.message
    });
  }
});

module.exports = router;
