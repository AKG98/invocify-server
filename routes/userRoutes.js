import { Router } from "express";
import { createUser, forgotPassword, getCurrentUser, googleLogin, loginUser, logoutUser, resetPassword, updateUserProfile }  from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { verifyToken } from "../middlewares/googleAuth.js";
const router = Router();

router.post("/signup",createUser);
router.post("/login",loginUser);
router.get("/get-current-user",authenticate,getCurrentUser);
router.post("/logout",logoutUser);
router.post("/google-auth",verifyToken,googleLogin);
router.put("/update-user/:id",updateUserProfile);
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:token",resetPassword);
export default router;
