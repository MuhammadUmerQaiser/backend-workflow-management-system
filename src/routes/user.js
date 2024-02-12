const express = require('express')
const { AdminSignup,login,EmployeeSignup,getAllEmployees } = require('../controllers/auth/index');
const AdminAuth = require ("../middleware/AdminAuth")
const router = express.Router();

router.post("/admin-register",AdminSignup)
router.post("/login",login)
router.post("/employee-signup",AdminAuth,EmployeeSignup)
router.get("/get-all-employees",AdminAuth,getAllEmployees)
// router.post("/verify-otp/:id",verifyOtp)

module.exports = router;