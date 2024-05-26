const { checkTargetDateMustBeFutureDate } = require("../../helpers");
const taskModel = require("../../models/task");

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
      assigned_to,
      assigned_by,
      due_date,
    });
    await task.save();

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

exports.getListOfAllMyTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData === "true";

    const totalTasks = await taskModel.countDocuments({ assigned_to: userId });

    const totalPages = Math.ceil(totalTasks / limit);

    let query = taskModel.find({ assigned_to: userId });

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

exports.getTaskDetailById = async (req, res) => {
  try {
    const task = await taskModel
      .findById(req.params.taskId)
      .populate("assigned_to", "-password")
      .populate("assigned_by", "-password");
    res.status(200).json({
      data: task,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching task details", error });
  }
};
