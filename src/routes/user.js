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
  getListOfAllMyTasks,
  getTaskDetailById,
} = require("../controllers/user/TaskController");

router.post("/create-user-workflow", userAuth, createUserWorkflow);
router.get("/get-user-workflow-history", userAuth, getUserWorkflowHistory);

router.post("/create-task", userAuth, createTask);
router.get("/get-all-tasks", userAuth, getAllTasks);
router.get("/get-my-tasks", userAuth, getListOfAllMyTasks);
router.get("/get-task/:taskId", userAuth, getTaskDetailById);

module.exports = router;
