const Application = require("../model/Application");
const Job = require("../model/Job");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/cvs';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('resume');

// Submit job application
exports.submitApplication = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('User info:', req.user);

      if (!req.file) {
        return res.status(400).json({ error: "Please upload a resume" });
      }

      const { name, jobId } = req.body;
      const userId = req.user.id;

      if (!name || !jobId) {
        // Delete uploaded file if required fields are missing
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Name and job ID are required" });
      }

      // Check if job exists
      const job = await Job.findByPk(jobId);
      if (!job) {
        // Delete uploaded file if job doesn't exist
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Job not found" });
      }

      // Check if user has already applied
      const existingApplication = await Application.findOne({
        where: {
          job_id: jobId,
          applied_by: userId
        }
      });

      if (existingApplication) {
        // Delete uploaded file if application exists
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "You have already applied for this job" });
      }

      // Create application
      const application = await Application.create({
        job_id: jobId,
        applicant_name: name,
        applied_by: userId,
        cv_path: req.file.path
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application
      });
    } catch (error) {
      console.error('Application submission error:', error);
      // Delete uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to submit application: " + error.message });
    }
  });
};

// Get applications for a job (only accessible by job poster)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if the job exists and was posted by the requesting user
    const job = await Job.findOne({
      where: {
        job_id: jobId,
        posted_by: userId
      }
    });

    if (!job) {
      return res.status(403).json({ error: "You don't have permission to view these applications" });
    }

    // Get all applications for the job
    const applications = await Application.findAll({
      where: { job_id: jobId },
      order: [['applied_date', 'DESC']]
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: "Failed to fetch applications: " + error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find the application
    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the job belongs to the user
    const job = await Job.findByPk(application.job_id);
    if (!job || job.posted_by !== userId) {
      return res.status(403).json({ error: "You don't have permission to update this application" });
    }

    // Update the status
    await application.update({ status });

    res.status(200).json({ message: 'Application status updated successfully', application });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// Get applications for the logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.findAll({
      where: { applied_by: userId },
      include: [{
        model: Job,
        attributes: ['position', 'company_name', 'job_location']
      }],
      order: [['applied_date', 'DESC']]
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ error: "Failed to fetch applications: " + error.message });
  }
};
