const express = require("express");
const { signup, verifyOtp, login } = require("../controllers/auth/index");

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/verify-otp/:id", verifyOtp);

module.exports = router;
