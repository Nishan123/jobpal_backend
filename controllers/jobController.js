const Job = require("../model/Job"); // Fix the path from "models" to "model"

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
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
    const {
      company_name,
      job_location,
      company_logo,
      position,
      description,
      experience,
      salary,
    } = req.body;

    await Job.create({
      company_name,
      job_location,
      company_logo,
      position,
      description,
      experience,
      salary,
    });

    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job" });
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
