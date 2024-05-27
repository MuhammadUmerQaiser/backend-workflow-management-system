const { checkTargetDateMustBeFutureDate } = require("../../helpers");
const taskModel = require("../../models/task");
const taskAssignmentModel = require("../../models/task-assignment");

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

exports.getListOfAllMyTaskAssignments = async (req, res) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData === "true";

    const totalTasks = await taskAssignmentModel.countDocuments({
      assigned_to: userId,
    });

    const totalPages = Math.ceil(totalTasks / limit);

    let query = taskAssignmentModel
      .find({ assigned_to: userId })
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
      .populate("task");
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
