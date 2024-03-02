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
  createDomain,
  getAllDomains,
  deleteDomain,
  updateDomain,
  createDesignation,
  getAllDesignations,
  deleteDesignation,
  updateDesignation,
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
  createGrade,
  getAllGrades,
  deleteGrade,
  updateGrade
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

//domains
router.post("/create-domain", AdminAuth, createDomain);
router.get("/get-all-domains", AdminAuth, getAllDomains);
router.delete("/delete-domain/:id", AdminAuth, deleteDomain);
router.put("/update-domain/:id", AdminAuth, updateDomain);

//designations
router.post("/create-designation", AdminAuth, createDesignation);
router.get("/get-all-designations", AdminAuth, getAllDesignations);
router.delete("/delete-designation/:id", AdminAuth, deleteDesignation);
router.put("/update-designation/:id", AdminAuth, updateDesignation);

//tasks
router.post("/create-task", AdminAuth, createTask);
router.get("/get-all-tasks", AdminAuth, getAllTasks);
router.delete("/delete-task/:id", AdminAuth, deleteTask);
router.put("/update-task/:id", AdminAuth, updateTask);

//grade
router.post("/create-grade", AdminAuth, createGrade);
router.get("/get-all-grades", AdminAuth, getAllGrades);
router.delete("/delete-grade/:id", AdminAuth, deleteGrade);
router.put("/update-grade/:id", AdminAuth, updateGrade);

module.exports = router;
