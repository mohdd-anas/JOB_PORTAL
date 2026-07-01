import express from "express";
import { register, login, logout, updateProfile, getCurrentUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate, registerSchema, loginSchema } from "../middlewares/validation.js";

const router = express.Router();

router.post("/register", singleUpload, validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getCurrentUser); // ✅ New session persistence endpoint
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

export default router;