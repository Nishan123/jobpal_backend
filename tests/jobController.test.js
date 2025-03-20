const { getJobs, getJobById, createJob, deleteJob } = require('../controllers/jobController');
const Job = require('../model/Job');

// Mock the Job model
jest.mock('../model/Job');

describe('Job Controller Tests', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            file: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getJobs', () => {
        test('should successfully get all jobs', async () => {
            const mockJobs = [
                {
                    job_id: 1,
                    company_name: 'Tech Corp',
                    position: 'Software Engineer',
                    job_location: 'New York'
                },
                {
                    job_id: 2,
                    company_name: 'Dev Inc',
                    position: 'Frontend Developer',
                    job_location: 'Remote'
                }
            ];

            Job.findAll.mockResolvedValue(mockJobs);

            await getJobs(req, res);

            expect(Job.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockJobs);
        });

        test('should handle errors when getting jobs fails', async () => {
            Job.findAll.mockRejectedValue(new Error('Database error'));

            await getJobs(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get jobs' });
        });
    });

    describe('getJobById', () => {
        test('should successfully get job by id', async () => {
            const mockJob = {
                job_id: 1,
                company_name: 'Tech Corp',
                position: 'Software Engineer',
                job_location: 'New York'
            };

            req.params.id = 1;
            Job.findByPk.mockResolvedValue(mockJob);

            await getJobById(req, res);

            expect(Job.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockJob);
        });

        test('should return 404 when job not found', async () => {
            req.params.id = 999;
            Job.findByPk.mockResolvedValue(null);

            await getJobById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
        });
    });

    describe('createJob', () => {
        test('should successfully create a job', async () => {
            const jobData = {
                posted_by: 1,
                company_name: 'Tech Corp',
                job_location: 'New York',
                position: 'Software Engineer',
                description: 'Job description',
                experience: '3 years',
                salary: '100000'
            };

            req.body = jobData;
            req.file = {
                filename: 'logo.png'
            };

            const mockCreatedJob = {
                job_id: 1,
                ...jobData,
                company_logo: 'http://localhost:5000/uploads/logo.png'
            };

            Job.create.mockResolvedValue(mockCreatedJob);

            await createJob(req, res);

            expect(Job.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Job created successfully',
                job: mockCreatedJob
            });
        });

        test('should handle errors in job creation', async () => {
            req.body = {};
            Job.create.mockRejectedValue(new Error('Validation error'));

            await createJob(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Failed to create job'
            }));
        });
    });

    describe('deleteJob', () => {
        test('should successfully delete a job', async () => {
            const mockJob = {
                job_id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };

            req.params.id = 1;
            Job.findByPk.mockResolvedValue(mockJob);

            await deleteJob(req, res);

            expect(mockJob.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'Job deleted' });
        });

        test('should return 404 when trying to delete non-existent job', async () => {
            req.params.id = 999;
            Job.findByPk.mockResolvedValue(null);

            await deleteJob(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
        });
    });
});
