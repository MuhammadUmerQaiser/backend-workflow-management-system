const express = require('express')
const { signup,verifyOtp } = require('../controllers/auth/index');

const router = express.Router();

router.post("/register",signup)
router.post("/verify-otp/:id",verifyOtp)

module.exports = router;