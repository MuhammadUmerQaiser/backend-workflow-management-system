const notificationModel = require("../../models/notification");

exports.createNotification = async (req, res) => {
  try {
    const { notificationNumber, date, description, information } = req.body;
    const notification = new notificationModel({
      notificationNumber,
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
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.notificationNumber
    ) {
      return res
        .status(400)
        .json({ message: "Notification number must be unique." });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const query = employeeId ? { "information.employeeId": employeeId } : {};

    const notifications = await notificationModel.find(query);

    res.status(200).json({
      message: "Notifications retrieved successfully",
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
      .populate('information.employeeId','-password')
      .populate('information.deskId');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification retrieved successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
