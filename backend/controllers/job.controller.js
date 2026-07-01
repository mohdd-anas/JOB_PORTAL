import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

// @desc    Post a new job
// @route   POST /api/v1/job/post
// @access  Private (Recruiter only)
export const postJob = asyncHandler(async (req, res, next) => {
    const { title, description, requirements, location, salary, experience, position, companyId, jobType } = req.body;
    const userId = req.id;

    // Verify company exists and is owned by the logged-in recruiter
    const company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, "Selected company not found");
    }

    if (company.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to post jobs for this company");
    }

    const parsedSalary = Number(salary);
    const parsedExperience = Number(experience);
    const parsedPosition = Number(position);

    const requirementsArray = Array.isArray(requirements)
        ? requirements
        : requirements.split(',').map(r => r.trim()).filter(Boolean);

    const job = await Job.create({
        title,
        description,
        requirements: requirementsArray,
        location,
        salary: parsedSalary,
        experienceLevel: parsedExperience,
        position: parsedPosition,
        jobType,
        company: companyId,
        created_by: userId
    });

    return res.status(201).json({ 
        success: true,
        message: "Job posted successfully", 
        job 
    });
});

// @desc    Get all jobs (with optional keyword query filter)
// @route   GET /api/v1/job/get
// @access  Public
export const getAllJobs = asyncHandler(async (req, res, next) => {
    const keyword = req.query.keyword || "";
    
    // Search query object
    const query = keyword
        ? {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
            ]
          }
        : {};

    const jobs = await Job.find(query)
        .populate("company")
        .sort({ createdAt: -1 });

    return res.status(200).json({ 
        success: true,
        message: "Jobs fetched successfully",
        jobs: jobs || [] 
    });
});

// @desc    Get single job by ID
// @route   GET /api/v1/job/getjob/:id
// @access  Private
export const getJobById = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;
    
    const job = await Job.findById(jobId)
        .populate("company")
        .populate({
            path: "applications",
            populate: { path: "applicant", select: "-password" }
        });

    if (!job) {
        throw new ApiError(404, "Job listing not found");
    }

    return res.status(200).json({ 
        success: true,
        message: "Job details fetched",
        job 
    });
});

// @desc    Get recruiter's posted jobs
// @route   GET /api/v1/job/getadminjobs
// @access  Private (Recruiter only)
export const getAdminJobs = asyncHandler(async (req, res, next) => {
    const adminId = req.id;
    
    const jobs = await Job.find({ created_by: adminId })
        .populate("company")
        .sort({ createdAt: -1 });

    return res.status(200).json({ 
        success: true,
        message: "Jobs fetched successfully",
        jobs: jobs || [] 
    });
});
