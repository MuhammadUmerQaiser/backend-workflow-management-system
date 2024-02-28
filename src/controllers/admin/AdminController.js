const express = require("express");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.EmployeeSignup = async (req, res) => {
  const {
    name,
    email,
    password,
    domain,
    designation,
    role,
    member,
    team,
    grade,
    tasks,
  } = req.body;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
      domain,
      designation,
      member,
      team,
      grade,
      tasks,
      // otp: otp,
      // isVerified: false,
      isDeleted: false,
    });
    const authtoken = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );
    res.status(200).json({
      data: result,
      authtoken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalUsers = await User.countDocuments({
      role: { $ne: "Admin" },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    const employees = await User.find({
      role: { $ne: "Admin" },
      _id: { $ne: req.userId },
      isDeleted: false,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await User.findById(id);

    if (!employee || employee.isDeleted === true) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const { password, ...filteredEmployeeData } = employee.toObject();

    res.status(200).json(filteredEmployeeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      role,
      domain,
      designation,
      member,
      team,
      grade,
      tasks,
    } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "No user found with this id" });
    }

    // Check if the user is deleted before allowing updates
    if (existingUser.isDeleted === true) {
      return res
        .status(400)
        .json({ message: "Invalid operation. User is deleted." });
    }

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.role = role || existingUser.role;
    existingUser.domain = domain || existingUser.domain;
    existingUser.designation = designation || existingUser.designation;
    existingUser.member = member || existingUser.member;
    existingUser.team = member == "group" ? team || existingUser.team : "";
    existingUser.grade = grade || existingUser.grade;
    existingUser.tasks = tasks || existingUser.tasks;

    const updatedUser = await existingUser.save();

    const { password, ...filteredUserData } = updatedUser.toObject();

    res.status(200).json(filteredUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found with this id" });
    }
    console.log("del", user.isDeleted);
    if (user.isDeleted === true) {
      return res.status(400).json({ message: "User already deleted" });
    }
    user.isDeleted = true;
    user.save();
    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
