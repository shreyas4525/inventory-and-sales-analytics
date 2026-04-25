import express from "express";
import { signup, loginUser, verifySignupOTP,forgotPassword,resetPassword} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);                 // send OTP
router.post("/verify-signup", verifySignupOTP); // verify OTP
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;