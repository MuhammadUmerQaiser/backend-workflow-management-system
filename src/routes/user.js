const express = require("express");
const router = express.Router();

const {
  createUserWorkflow,
  getUserWorkflowHistory,
} = require("../controllers/user/WorkflowController");
const { userAuth } = require("../middleware/authentication");
const {
  createTask,
  getAllTasks,
} = require("../controllers/user/TaskController");

router.post("/create-user-workflow", userAuth, createUserWorkflow);
router.get("/get-user-workflow-history", userAuth, getUserWorkflowHistory);

router.post("/create-task", userAuth, createTask);
router.get("/get-all-tasks", userAuth, getAllTasks);

module.exports = router;
