const express = require("express");
const {
  EmployeeSignup,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  createTaxPayer,
  updateTaxPayer,
  getAllTaxPayers,
  deleteTaxPayer
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
  updateGrade,
  createTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
} = require("../controllers/admin/GeneralController");
const { AdminAuth } = require("../middleware/authentication");
const {
  getAllUserWorkflowHistory,
} = require("../controllers/admin/WorkflowController");
const {
  createCategory,
  getAllCategries,
  deleteCategory,
  updateCategory,
  createSubCategory,
  getAllSubCategries,
  deleteSubCategory,
  updateSubCategory,
} = require("../controllers/admin/CategoryController");
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

//team
router.post("/create-team", AdminAuth, createTeam);
router.get("/get-all-teams", AdminAuth, getAllTeams);
router.delete("/delete-team/:id", AdminAuth, deleteTeam);
router.put("/update-team/:id", AdminAuth, updateTeam);

//category
router.post("/create-category", AdminAuth, createCategory);
router.get("/get-all-categories", AdminAuth, getAllCategries);
router.delete("/delete-category/:id", AdminAuth, deleteCategory);
router.put("/update-category/:id", AdminAuth, updateCategory);

//sub-category
router.post("/create-sub-category", AdminAuth, createSubCategory);
router.get("/get-all-sub-categories", AdminAuth, getAllSubCategries);
router.delete("/delete-sub-category/:id", AdminAuth, deleteSubCategory);
router.put("/update-sub-category/:id", AdminAuth, updateSubCategory);

//tax-payer
router.post("/create-tax-payer", AdminAuth, createTaxPayer);
router.get("/get-all-tax-payers", AdminAuth, getAllTaxPayers);
router.delete("/delete-tax-payer/:id", AdminAuth, deleteTaxPayer);
router.put("/update-tax-payer/:id", AdminAuth, updateTaxPayer);

router.get(
  "/get-all-user-workflow-history",
  AdminAuth,
  getAllUserWorkflowHistory
);

module.exports = router;
