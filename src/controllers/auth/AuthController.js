const express = require("express");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// const sendEmail = require("../../utils/sendEmail");

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
      "harisisagoodboy",
      { expiresIn: "100y" }
    );
    res.status(200).json({
      result: {
        id: existingUser._id,
        // isVerified: existingUser.isVerified,
        role: existingUser.role,
        name: existingUser.name,
        email: existingUser.email,
        domain: existingUser.domain,
        designation: existingUser.designation,
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
      process.env.JWT_SECRET,
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
