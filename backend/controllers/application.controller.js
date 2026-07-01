import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

// @desc    Apply for a job
// @route   POST /api/v1/application/apply/:id
// @access  Private (Student only)
export const applyJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;
    const userId = req.id;

    // Retrieve job listing
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job listing not found");
    }

    // Verify user is a student (only students can apply for jobs)
    // The role is checked at API level as well
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
        throw new ApiError(400, "You have already applied for this job");
    }

    // Create application
    const newApplication = await Application.create({ 
        job: jobId, 
        applicant: userId 
    });

    // Link application to job
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({ 
        success: true,
        message: "Job application submitted successfully" 
    });
});

// @desc    Get current user's job applications
// @route   GET /api/v1/application/get
// @access  Private (Student only)
export const getApplicationsByJobId = asyncHandler(async (req, res, next) => {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'job',
            populate: { path: 'company' }
        });

    return res.status(200).json({ 
        success: true,
        message: "Applications fetched successfully",
        applications: applications || [] 
    });
});

// @desc    Get all applicants for a recruiter's job
// @route   GET /api/v1/application/:id/applicants
// @access  Private (Recruiter only)
export const getApplicants = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;

    // Verify job exists and is owned by the logged-in recruiter
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job listing not found");
    }

    if (job.created_by.toString() !== req.id.toString()) {
        throw new ApiError(403, "You do not have permission to view applicants for this job");
    }

    const jobWithApplicants = await Job.findById(jobId).populate({
        path: 'applications',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'applicant', select: '-password' }
    });

    return res.status(200).json({
        success: true,
        message: "Applicants fetched successfully",
        applicants: jobWithApplicants.applications || []
    });
});

// @desc    Update application status
// @route   POST /api/v1/application/status/:id/update
// @access  Private (Recruiter only)
export const updateStatus = asyncHandler(async (req, res, next) => {
    const applicationId = req.params.id;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    // Verify the logged-in recruiter owns the job associated with this application
    if (application.job.created_by.toString() !== req.id.toString()) {
        throw new ApiError(403, "You do not have permission to update the status of this application");
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({ 
        success: true,
        message: `Application status updated to ${status} successfully` 
    });
});
