import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postJob, getAllJobs, getAdminJobs, getJobById } from "../controllers/job.controller.js";
import { validate, jobPostSchema } from "../middlewares/validation.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, validate(jobPostSchema), postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/getjob/:id").get(isAuthenticated, getJobById);

export default router;