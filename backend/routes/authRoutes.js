import express from "express";
import { signup, loginUser, verifySignupOTP } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);                 // send OTP
router.post("/verify-signup", verifySignupOTP); // verify OTP
router.post("/login", loginUser);

export default router;