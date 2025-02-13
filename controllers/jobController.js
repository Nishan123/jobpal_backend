const Job = require("../model/Job"); 
const path = require('path');

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    console.log('Jobs with logos:', jobs.map(job => ({
      id: job.job_id,
      logo: job.company_logo
    })));
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get jobs" });
  }
};

// Get job by id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get job" });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received file:', req.file);

    const logoUrl = req.file 
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    console.log('Logo URL:', logoUrl);

    const jobData = {
      posted_by: req.body.posted_by,
      company_name: req.body.company_name,
      job_location: req.body.job_location,
      position: req.body.position,
      description: req.body.description,
      experience: req.body.experience,
      salary: req.body.salary,
      company_logo: logoUrl
    };

    console.log('Processing job data:', jobData);

    const newJob = await Job.create(jobData);
    
    res.status(201).json({ 
      message: "Job created successfully",
      job: newJob 
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ 
      error: "Failed to create job",
      details: error.message 
    });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await job.destroy();
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
};
