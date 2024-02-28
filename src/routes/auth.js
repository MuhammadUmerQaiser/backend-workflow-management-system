const express = require("express");
const { AdminSignup, login } = require("../controllers/auth/AuthController");
const router = express.Router();

router.post("/admin-register", AdminSignup);
router.post("/login", login);
// router.post("/verify-otp/:id",verifyOtp)

module.exports = router;
