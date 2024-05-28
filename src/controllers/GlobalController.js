const mongoose = require("mongoose");
const userModel = require("../models/user");
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
