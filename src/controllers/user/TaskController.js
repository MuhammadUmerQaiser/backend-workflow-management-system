const { checkTargetDateMustBeFutureDate } = require("../../helpers");
const taskModel = require("../../models/task");
const taskAssignmentModel = require("../../models/task-assignment");
const taskHistoryModel = require("../../models/task-history");
const taskResponseModel = require("../../models/task-responses");
const userModel = require("../../models/user");
const config = require("../../config");
const admin = require("../../firebaseAdmin");

exports.createTask = async (req, res) => {
  try {
    const { name, description, assigned_to, assigned_by, due_date } = req.body;

    const checkDate = checkTargetDateMustBeFutureDate(due_date);
    if (!checkDate) {
      return res.status(400).json({ message: "Date must be from future." });
    }
    const task = new taskModel({
      name,
      description,
      // assigned_to,
      assigned_by,
      due_date,
    });
    await task.save();

    assigned_to.forEach(async (assigneeId) => {
      const assignment = new taskAssignmentModel({
        task: task._id,
        assigned_to: assigneeId,
        assignment_reference: assigned_by,
      });
      await assignment.save();
    });

    res.status(200).json({
      message: `Task created successfully`,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalTasks = await taskModel.countDocuments();

    const totalPages = Math.ceil(totalTasks / limit);

    let query = taskModel.find();

    if (paginatedData == "true") {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const tasks = await query.exec();

    const tasksWithAssignments = await Promise.all(
      tasks.map(async (task) => {
        const assignments = await taskAssignmentModel
          .find({ task: task._id })
          .populate("assigned_to", "-password")
          .populate("assignment_reference", "-password")
          .exec();
        return {
          ...task.toObject(),
          task_assignments: assignments,
        };
      })
    );

    res.status(200).json({
      data: tasksWithAssignments,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getListOfAllMyTaskAssignments = async (req, res) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData === "true";

    // const totalTasks = await taskAssignmentModel.countDocuments({
    //   assigned_to: userId,
    // });
    const totalTasks = await taskAssignmentModel.countDocuments({
      $or: [{ assigned_to: userId }, { "transfer.assignee": userId }],
    });

    const totalPages = Math.ceil(totalTasks / limit);

    // let query = taskAssignmentModel
    //   .find({ assigned_to: userId })
    //   .populate("task");
    let query = taskAssignmentModel
      .find({
        $or: [{ assigned_to: userId }, { "transfer.assignee": userId }],
      })
      .populate("task");

    if (paginatedData) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const tasks = await query.exec();

    res.status(200).json({
      data: tasks,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTaskAssignmentDetailById = async (req, res) => {
  try {
    const task = await taskAssignmentModel
      .findById(req.params.taskAssignmentId)
      .populate("assigned_to", "-password")
      .populate("assignment_reference", "-password")
      .populate("task transfer.assignee transfer.assigned_by");
    res.status(200).json({
      data: task,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching task details", error });
  }
};

exports.getListOfAllTaskAssignmentBaseOnTaskId = async (req, res) => {
  try {
    const task = await taskAssignmentModel
      .find({ task: req.params.taskId })
      .populate("assigned_to", "-password")
      .populate("assignment_reference", "-password")
      .populate("task");
    res.status(200).json({
      data: task,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching task details", error });
  }
};

exports.initiateAndContinueTheResponsOfSpecificTaskAssugnment = async (
  req,
  res
) => {
  try {
    const { reciever, sender, response } = req.body;
    const taskAssignmentId = req.params.taskAssignmentId;
    const file = req.file ? req.file.filename : null;

    const existingTaskResponse = await taskResponseModel.findOne({
      reciever,
      sender,
      task_assignment: taskAssignmentId,
    });

    const senderUser = await userModel.findById(sender);
    const recieverUser = await userModel.findById(reciever);

    if (!existingTaskResponse && senderUser.role != "Admin") {
      const taskHistory = new taskHistoryModel({
        user: sender,
        task_assignment: taskAssignmentId,
      });
      await taskHistory.save();
    }

    const taskResponse = new taskResponseModel({
      reciever,
      sender,
      response,
      task_assignment: taskAssignmentId,
      file,
    });
    await taskResponse.save();

    if (recieverUser && recieverUser.token) {
      const message = {
        notification: {
          title: `Task Response From ${senderUser.name}`,
          body: response,
        },
        token: recieverUser.token,
      };

      const noti = await admin.messaging().send(message);
      console.log("Successfully sent message:", noti);
    }

    res.status(200).json({
      message: "Response sent successfully.",
      data: taskResponse,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching task details", error });
  }
};

exports.getTheResponsesOfSameSenderAndReciever = async (req, res) => {
  try {
    const reciever = req.query.reciever;
    const sender = req.query.sender;
    const taskAssignmentId = req.params.taskAssignmentId;

    const taskAssignment = await taskAssignmentModel.findById(taskAssignmentId);
    if (!taskAssignment) {
      return res.status(404).json({ message: "Task assignment not found" });
    }

    // Find the latest transfer event for the current user
    const latestTransfer = taskAssignment.transfer
      .filter((transfer) => transfer.assigned_by.toString() === sender)
      .sort((a, b) => b.transferred_at - a.transferred_at)[0];

    const query = {
      task_assignment: taskAssignmentId,
    };

    // Exclude messages after the latest transfer event
    if (latestTransfer) {
      query.createdAt = { $lt: latestTransfer.transferred_at };
    }

    const responseHistory = await taskResponseModel
      .find(query)
      .populate("reciever sender task_assignment")
      .sort({ createdAt: 1 });

    const responseHistoryWithFileURL = responseHistory.map((response) => {
      if (response.file) {
        response = response.toObject();
        response.file_url = `${config.BASE_URL}${response.file}`;
      }
      return response;
    });

    res.status(200).json({
      data: responseHistoryWithFileURL,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};

exports.transrerTaskAssignmentToAnotherEmployee = async (req, res) => {
  try {
    const userId = req.userId;
    const { assigned_to } = req.body;
    const taskAssignmentId = req.params.taskAssignmentId;

    const assigneeUser = await userModel.findById(assigned_to);
    const assignedByUser = await userModel.findById(userId);

    const existingTaskAssignment = await taskAssignmentModel.findById(
      taskAssignmentId
    );
    if (existingTaskAssignment) {
      existingTaskAssignment.transfer.push({
        assignee: assigned_to,
        assigned_by: userId,
        transferred_at: new Date(),
      });
      const transferResponse = existingTaskAssignment.transfer.find(
        (item) => item.assignee === userId
      );
      if (transferResponse) {
        transferResponse.is_task_response = false;
      }

      existingTaskAssignment.is_task_response = false;
      await existingTaskAssignment.save();
      const transferMessage = `Task transferred from ${assignedByUser.name} to ${assigneeUser.name}`;
      const taskResponse = new taskResponseModel({
        task_assignment: taskAssignmentId,
        sender: userId,
        reciever: assigned_to,
        response: transferMessage,
        type: "transfer",
      });

      await taskResponse.save();

      const existingTaskHistory = await taskHistoryModel.findOne({
        user: userId,
        status: "In Progress",
        removed: null,
      });
      if (existingTaskHistory) {
        existingTaskHistory.status = "Transferred";
        existingTaskHistory.removed = Date.now();
        await existingTaskHistory.save();
      }
    }
    res.status(200).json({
      message: "Assignment transfered successfully.",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error", error });
  }
};

exports.requestToCloseTheTaskAssignment = async (req, res) => {
  try {
    const userId = req.userId;
    const taskAssignmentId = req.params.taskAssignmentId;
    const existingTaskAssignment = await taskAssignmentModel.findById(
      taskAssignmentId
    );
    if (existingTaskAssignment) {
      existingTaskAssignment.close_assignment_request = "pending";
      existingTaskAssignment.task_rejection_reason = null;
      existingTaskAssignment.close_request_generation = userId;
      await existingTaskAssignment.save();
    }
    res.status(200).json({
      message: "Close task request submitted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error", error });
  }
};

exports.updateTheRequestStatusForTaskAssignment = async (req, res) => {
  try {
    const taskAssignmentId = req.params.taskAssignmentId;
    const { task_close_request_status, reason } = req.body;
    const existingTaskAssignment = await taskAssignmentModel.findById(
      taskAssignmentId
    );
    if (existingTaskAssignment) {
      existingTaskAssignment.close_assignment_request =
        task_close_request_status;
      if (task_close_request_status == "rejected") {
        existingTaskAssignment.task_rejection_reason = reason;
      } else {
        existingTaskAssignment.task_rejection_reason = null;
      }

      await existingTaskAssignment.save();

      const existingTaskHistory = await taskHistoryModel.findOne({
        task_assignment: taskAssignmentId,
        user: existingTaskAssignment.close_request_generation,
        removed: null,
      });
      console.log(
        "existingTaskHistory=====================",
        existingTaskHistory
      );
      console.log(
        "task_close_request_status=====================",
        task_close_request_status
      );
      if (existingTaskHistory && task_close_request_status != "rejected") {
        existingTaskHistory.status = "Completed";
        existingTaskHistory.removed = Date.now();
        await existingTaskHistory.save();
      }
    }

    res.status(200).json({
      message: `Task has been ${task_close_request_status}`,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error", error });
  }
};

exports.getDetailOfTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskModel.findById(taskId).populate("assigned_by");

    const taskAssignments = await taskAssignmentModel
      .find({ task: task._id })
      .populate(
        "assigned_to transfer assignment_reference transfer.assignee transfer.assigned_by"
      );

    res.status(200).json({
      data: { taskAssignments, task },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
