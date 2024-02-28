const express = require("express");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// const sendEmail = require("../../utils/sendEmail");

const JWT_SECRET = "Harryisagoodb$oy";

// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials." });

    // if (existingUser.isVerified === true) {
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      },
      JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({
      result: {
        id: existingUser._id,
        // isVerified: existingUser.isVerified,
        role: existingUser.role,
      },
      token,
    });
    // } else {
    //   res.status(401).json({ message: "invalid otp" });
    // }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.AdminSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      // otp: otp,
      // isVerified: false,
    });
    const authtoken = jwt.sign(
      { email: result.email, id: result._id, role: result.role },
      JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );
    // sendEmail(email, otp);
    res.status(200).json({
      result: {
        name: name,
        email: email,
        role: result.role,
        // otp: otp,
        // isVerified: false,
        _id: result._id,
      },
      authtoken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

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
      JWT_SECRET,
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

// exports.verifyOtp = async (req, res) => {
//   const { otp } = req.body;
//   const { id } = req.params;

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: id, otp },
//       { $set: { isVerified: true } },
//       { new: true }
//     );

//     if (updatedUser) {
//       res
//         .status(200)
//         .json({ updatedUser, message: "OTP verified successfully" });
//     } else {
//       res.status(400).json({ message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error verifying OTP" });
//   }
// };
