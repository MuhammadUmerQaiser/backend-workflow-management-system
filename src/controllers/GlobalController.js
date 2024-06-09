const mongoose = require("mongoose");
const userModel = require("../models/user");
const deskHistoryModel = require("../models/desk-history");
const taskHistoryModel = require("../models/task-history");
const { getRoleLevel } = require("../helpers");

const roles = [
  { name: "Chariman", level: 1 },
  { name: "Senior Member", level: 2 },
  { name: "Member", level: 3 },
  { name: "Commissioner", level: 4 },
  { name: "Deputy Commissioner", level: 5 },
  { name: "Assistant Commissioner", level: 6 },
  { name: "SSTO", level: 7 },
];

exports.getUsersWithLowerRoles = async (req, res) => {
  try {
    const userId = req.userId;
    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    const currentUserRoleLevel = getRoleLevel(currentUser.role);
    if (currentUserRoleLevel === null) {
      throw new Error("Invalid role for current user");
    }

    const users = await userModel.find({
      role: { $ne: "Admin" },
      role: {
        $in: roles
          .filter((role) => role.level > currentUserRoleLevel)
          .map((role) => role.name),
      },
    });

    res.status(200).json({ data: users });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};

exports.getMyDeskHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalEntities = await deskHistoryModel.countDocuments({
      user: userId,
    });
    const totalPages = Math.ceil(totalEntities / limit);

    const deskHistory = await deskHistoryModel
      .find({
        user: userId,
      })
      .populate("user desk")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      data: deskHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMyTaskkHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalEntities = await taskHistoryModel.countDocuments({
      user: userId,
    });
    const totalPages = Math.ceil(totalEntities / limit);

    const taskHistory = await taskHistoryModel
      .find({
        user: userId,
      })
      .populate("user task_assignment")
      .populate({
        path: "task_assignment",
        populate: {
          path: "task",
        },
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      data: taskHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveUserWebTokenForPushNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { token } = req.body;
    const user = await userModel.findById(userId);

    if (user) {
      user.token = token;
      user.save();
    }
    res.status(200).json({
      message: "Token saved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTheListOfTaxPayerAssociatedWithEmployee = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).populate({
      path: "associated",
      populate: {
        path: "working_group",
        populate: {
          path: "tax_payer",
          populate: {
            path: 'category sub_category'
          }
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let taxPayers = [];

    if (user.associated && user.associated.working_group) {
      taxPayers = user.associated.working_group.reduce((acc, group) => {
        if (group.tax_payer) {
          acc.push(...group.tax_payer);
        }
        return acc;
      }, []);
    }

    res.status(200).json({
      data: taxPayers,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
