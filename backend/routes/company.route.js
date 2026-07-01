import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate, companyRegisterSchema, companyUpdateSchema } from "../middlewares/validation.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, validate(companyRegisterSchema), registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, validate(companyUpdateSchema), updateCompany);

export default router;