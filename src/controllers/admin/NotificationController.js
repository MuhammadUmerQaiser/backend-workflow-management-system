const notificationModel = require("../../models/notification");

exports.createNotification = async (req, res) => {
  try {
    const { number, date, description, information } = req.body;
    const notification = new notificationModel({
      number,
      date,
      description,
      information,
    });
    await notification.save();

    res.status(200).json({
      message: `Notification created successfully`,
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalEntities = await notificationModel.countDocuments();
    const totalPages = Math.ceil(totalEntities / limit);

    const query = employeeId ? { "information.employeeId": employeeId } : {};

    const notifications = await notificationModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationModel
      .findById(id)
      .populate("information.employeeId", "-password")
      .populate("information.deskId");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await notificationModel.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
      data: deletedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDetailOfNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await notificationModel
      .findById(notificationId)
      .populate("information");

    res.status(200).json({
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
