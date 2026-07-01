import { supabase } from "../utils/supabase.js";
import { mapJob, mapCompany } from "../utils/mappers.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

export const postJob = asyncHandler(async (req, res, next) => {
    const { title, description, requirements, location, salary, experience, position, companyId, jobType } = req.body;
    const userId = req.id;

    const { data: company, error: cErr } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .maybeSingle();

    if (cErr) throw new ApiError(500, cErr.message);
    if (!company) throw new ApiError(404, "Selected company not found");

    if (company.user_id !== userId)
        throw new ApiError(403, "You do not have permission to post jobs for this company");

    const requirementsArray = Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()).filter(Boolean);

    const { data, error } = await supabase
        .from("jobs")
        .insert({
            title,
            description,
            requirements: requirementsArray,
            location,
            salary: Number(salary),
            experience_level: Number(experience),
            position: Number(position),
            job_type: jobType,
            company_id: companyId,
            created_by: userId,
        })
        .select()
        .single();

    if (error) throw new ApiError(500, error.message);

    return res.status(201).json({
        success: true,
        message: "Job posted successfully",
        job: mapJob(data, mapCompany(company), []),
    });
});

export const getAllJobs = asyncHandler(async (req, res, next) => {
    const keyword = req.query.keyword || "";

    let query = supabase
        .from("jobs")
        .select(`
            *,
            company:companies(*)
        `)
        .order("created_at", { ascending: false });

    if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,location.ilike.%${keyword}%`);
    }

    const { data, error } = await query;

    if (error) throw new ApiError(500, error.message);

    // Fetch application counts for each job
    const jobIds = (data || []).map((j) => j.id);
    let appCounts = {};
    if (jobIds.length > 0) {
        const { data: apps } = await supabase
            .from("applications")
            .select("job_id")
            .in("job_id", jobIds);
        if (apps) {
            apps.forEach((a) => {
                appCounts[a.job_id] = (appCounts[a.job_id] || 0) + 1;
            });
        }
    }

    const jobs = (data || []).map((row) =>
        mapJob(row, mapCompany(row.company), Array(appCounts[row.id] || 0).fill(null))
    );

    return res.status(200).json({
        success: true,
        message: "Jobs fetched successfully",
        jobs,
    });
});

export const getJobById = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;

    const { data: job, error: jErr } = await supabase
        .from("jobs")
        .select(`
            *,
            company:companies(*)
        `)
        .eq("id", jobId)
        .maybeSingle();

    if (jErr) throw new ApiError(500, jErr.message);
    if (!job) throw new ApiError(404, "Job listing not found");

    // Fetch applications with applicant details
    const { data: apps, error: aErr } = await supabase
        .from("applications")
        .select(`
            *,
            applicant:users(*)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

    if (aErr) throw new ApiError(500, aErr.message);

    const applications = (apps || []).map((a) => {
        const applicantData = a.applicant;
        if (applicantData) delete applicantData.password;
        return {
            _id: a.id,
            applicant: applicantData ? { _id: applicantData.id, fullname: applicantData.fullname, email: applicantData.email, phoneNumber: applicantData.phone_number, profile: { profilePhoto: applicantData.profile_photo, resume: applicantData.resume, resumeOriginalName: applicantData.resume_original_name } } : null,
            status: a.status,
            createdAt: a.created_at,
        };
    });

    return res.status(200).json({
        success: true,
        message: "Job details fetched",
        job: mapJob(job, mapCompany(job.company), applications),
    });
});

export const getAdminJobs = asyncHandler(async (req, res, next) => {
    const { data, error } = await supabase
        .from("jobs")
        .select(`
            *,
            company:companies(*)
        `)
        .eq("created_by", req.id)
        .order("created_at", { ascending: false });

    if (error) throw new ApiError(500, error.message);

    const jobs = (data || []).map((row) => mapJob(row, mapCompany(row.company), []));

    return res.status(200).json({
        success: true,
        message: "Jobs fetched successfully",
        jobs,
    });
});
