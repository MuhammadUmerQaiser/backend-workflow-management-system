const {
  checkTargetDateIsNotFutureDate,
  checkTargetTimeIsNotFutureTime,
} = require("../../helpers");
const workflowModel = require("../../models/workflow");

exports.createUserWorkflow = async (req, res) => {
  const { task, time, date, meeting, related } = req.body;
  try {
    const checkDate = checkTargetDateIsNotFutureDate(date);
    const checkTime = checkTargetTimeIsNotFutureTime(time, date);
    if (!checkDate) {
      return res.status(400).json({ message: "Date should be valid" });
    } else if (!checkTime) {
      return res.status(400).json({ message: "Time should be valid" });
    } else {
      const newUserWorkflow = new workflowModel({
        task,
        time,
        date,
        meeting,
        related,
        user: req.userId,
      });
      await newUserWorkflow.save();
      return res.status(200).json({
        message: "Your task has been recorded",
        data: newUserWorkflow,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserWorkflowHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalWorkflowHistories = await workflowModel.countDocuments({
      user: req.userId,
    });
    const totalPages = Math.ceil(totalWorkflowHistories / limit);

    const workflowHistories = await workflowModel
      .find({
        user: req.userId,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: workflowHistories,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
