const express = require("express");
const {
  EmployeeSignup,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/admin/AdminController");
const {
  createRole,
  getAllRoles,
  deleteRole,
  updateRole,
} = require("../controllers/admin/GeneralController");
const AdminAuth = require("../middleware/AdminAuth");
const router = express.Router();

router.post("/employee-signup", AdminAuth, EmployeeSignup);
router.get("/get-all-employees", AdminAuth, getAllEmployees);
router.get("/get-employee/:id", AdminAuth, getEmployeeById);
router.put("/update-employee/:id", AdminAuth, updateEmployee);
router.delete("/delete-employee/:id", AdminAuth, deleteEmployee);

//roles
router.post("/create-role", AdminAuth, createRole);
router.get("/get-all-roles", AdminAuth, getAllRoles);
router.delete("/delete-role/:id", AdminAuth, deleteRole);
router.put("/update-role/:id", AdminAuth, updateRole);

module.exports = router;
