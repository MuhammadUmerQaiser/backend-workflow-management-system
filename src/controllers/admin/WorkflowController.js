const workflowModel = require("../../models/workflow");

exports.getAllUserWorkflowHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalWorkflowHistories = await workflowModel.countDocuments();
    const totalPages = Math.ceil(totalWorkflowHistories / limit);

    const workflowHistories = await workflowModel
      .find()
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
