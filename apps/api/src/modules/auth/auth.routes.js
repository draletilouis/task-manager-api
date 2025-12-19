import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
    registerValidation,
    loginValidation,
    refreshTokenValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} from "./auth.validation.js";

const router = Router();

router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post("/refresh", refreshTokenValidation, validate, authController.refresh);
router.post("/change-password", authMiddleware, changePasswordValidation, validate, authController.changePassword);
router.post("/forgot-password", forgotPasswordValidation, validate, authController.requestPasswordReset);
router.post("/reset-password", resetPasswordValidation, validate, authController.resetPassword);

export default router;