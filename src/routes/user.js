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
  getListOfAllMyTaskAssignments,
  getTaskAssignmentDetailById,
  getListOfAllTaskAssignmentBaseOnTaskId,
  initiateAndContinueTheResponsOfSpecificTaskAssugnment,
  getTheResponsesOfSameSenderAndReciever,
  transrerTaskAssignmentToAnotherEmployee,
  requestToCloseTheTaskAssignment,
  updateTheRequestStatusForTaskAssignment,
} = require("../controllers/user/TaskController");
const {
  getUsersWithLowerRoles,
  getMyDeskHistory,
  getMyTaskkHistory,
  saveUserWebTokenForPushNotification,
  getTheListOfTaxPayerAssociatedWithEmployee,
} = require("../controllers/GlobalController");
const { uploadImage } = require("../helpers");

router.post("/create-user-workflow", userAuth, createUserWorkflow);
router.get("/get-user-workflow-history", userAuth, getUserWorkflowHistory);

router.post("/create-task", userAuth, createTask);
router.get("/get-all-tasks", userAuth, getAllTasks);
router.get(
  "/get-my-tasks-assignments",
  userAuth,
  getListOfAllMyTaskAssignments
);
router.get(
  "/get-task-assignment/:taskAssignmentId",
  userAuth,
  getTaskAssignmentDetailById
);
router.get(
  "/get-task-assignment-by-task/:taskId",
  userAuth,
  getListOfAllTaskAssignmentBaseOnTaskId
);
router.post(
  "/initate-the-response-of-task-assignment/:taskAssignmentId",
  userAuth,
  uploadImage("file"),
  initiateAndContinueTheResponsOfSpecificTaskAssugnment
);
router.get(
  "/get-response-history/:taskAssignmentId",
  userAuth,
  getTheResponsesOfSameSenderAndReciever
);
router.get("/get-users-with-lower-roles", userAuth, getUsersWithLowerRoles);
router.post(
  "/transfer-task-assignment-to-another-employee/:taskAssignmentId",
  userAuth,
  transrerTaskAssignmentToAnotherEmployee
);
router.post(
  "/close-task-assignment-request/:taskAssignmentId",
  userAuth,
  requestToCloseTheTaskAssignment
);
router.post(
  "/update-the-request-status-for-close-task/:taskAssignmentId",
  userAuth,
  updateTheRequestStatusForTaskAssignment
);
router.get("/get-my-desk-history", userAuth, getMyDeskHistory);
router.get("/get-my-task-history", userAuth, getMyTaskkHistory);

router.post(
  "/save-user-web-token-for-notification",
  userAuth,
  saveUserWebTokenForPushNotification
);

router.get(
  "/get-user-associated-tax-payer",
  userAuth,
  getTheListOfTaxPayerAssociatedWithEmployee
);

module.exports = router;
