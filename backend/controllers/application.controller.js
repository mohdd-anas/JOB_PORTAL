import { supabase } from "../utils/supabase.js";
import { mapApplication, mapJob, mapCompany, mapUser } from "../utils/mappers.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

export const applyJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;
    const userId = req.id;

    const { data: job, error: jErr } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .maybeSingle();

    if (jErr) throw new ApiError(500, jErr.message);
    if (!job) throw new ApiError(404, "Job listing not found");

    const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("applicant_id", userId)
        .maybeSingle();

    if (existing) throw new ApiError(400, "You have already applied for this job");

    const { error } = await supabase
        .from("applications")
        .insert({ job_id: jobId, applicant_id: userId });

    if (error) throw new ApiError(500, error.message);

    return res.status(201).json({
        success: true,
        message: "Job application submitted successfully",
    });
});

export const getApplicationsByJobId = asyncHandler(async (req, res, next) => {
    const userId = req.id;

    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            job:jobs(
                *,
                company:companies(*)
            )
        `)
        .eq("applicant_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw new ApiError(500, error.message);

    const applications = (data || []).map((row) => {
        const jobRow = row.job;
        const companyRow = jobRow ? jobRow.company : null;
        const job = jobRow ? mapJob(jobRow, mapCompany(companyRow), []) : null;
        return mapApplication(row, job, null);
    });

    return res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        applications,
    });
});

export const getApplicants = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;

    const { data: job, error: jErr } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .maybeSingle();

    if (jErr) throw new ApiError(500, jErr.message);
    if (!job) throw new ApiError(404, "Job listing not found");

    if (job.created_by !== req.id)
        throw new ApiError(403, "You do not have permission to view applicants for this job");

    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            applicant:users(*)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

    if (error) throw new ApiError(500, error.message);

    const applicants = (data || []).map((row) => {
        const applicantData = row.applicant;
        if (applicantData) delete applicantData.password;
        const user = mapUser(applicantData);
        delete user.password;
        return {
            _id: row.id,
            applicant: user,
            status: row.status,
            createdAt: row.created_at,
        };
    });

    return res.status(200).json({
        success: true,
        message: "Applicants fetched successfully",
        applicants,
    });
});

export const updateStatus = asyncHandler(async (req, res, next) => {
    const applicationId = req.params.id;
    const { status } = req.body;

    const { data: application, error: aErr } = await supabase
        .from("applications")
        .select(`
            *,
            job:jobs(*)
        `)
        .eq("id", applicationId)
        .maybeSingle();

    if (aErr) throw new ApiError(500, aErr.message);
    if (!application) throw new ApiError(404, "Application not found");

    if (application.job.created_by !== req.id)
        throw new ApiError(403, "You do not have permission to update the status of this application");

    const { error } = await supabase
        .from("applications")
        .update({ status: status.toLowerCase() })
        .eq("id", applicationId);

    if (error) throw new ApiError(500, error.message);

    return res.status(200).json({
        success: true,
        message: `Application status updated to ${status} successfully`,
    });
});
