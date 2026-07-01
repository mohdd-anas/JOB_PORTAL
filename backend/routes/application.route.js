import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicationsByJobId, getApplicants, updateStatus } from "../controllers/application.controller.js";
import { validate, applicationStatusSchema } from "../middlewares/validation.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getApplicationsByJobId);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, validate(applicationStatusSchema), updateStatus);

export default router;