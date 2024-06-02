const express = require("express");
const User = require("../../models/user");
const taxPayerModel = require("../../models/tax-payer");
const deskHistoryModel = require("../../models/desk-history");
const taskHistoryModel = require("../../models/task-history");
const entityController = require("../../utils/entityController");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

exports.EmployeeSignup = async (req, res) => {
  const {
    name,
    email,
    password,
    domain,
    designation,
    role,
    // member,
    // team,
    // grade,
    // tasks,
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
      // member,
      // team,
      // grade,
      // tasks,
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
    const paginatedData = req.query.paginatedData || false;

    const totalUsers = await User.countDocuments({
      role: { $ne: "Admin" },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    let query = User.find({
      role: { $ne: "Admin" },
      _id: { $ne: req.userId },
      isDeleted: false,
    });

    if (paginatedData == "true") {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const employees = await query.exec();
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
      // member,
      // team,
      // grade,
      // tasks,
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
    // existingUser.member = member || existingUser.member;
    // existingUser.team = member == "group" ? team || existingUser.team : "";
    // existingUser.grade = grade || existingUser.grade;
    // existingUser.tasks = tasks || existingUser.tasks;

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

exports.createTaxPayer = async (req, res) => {
  try {
    const { name, category, sub_category, ntn } = req.body;
    // const workbook = xlsx.readFile(req.file.filename);
    if (!req.file) {
      saveTaxPayerInDatabase(name, category, sub_category, ntn);
    } else {
      // Read the Excel file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      const keys = Object.keys(data[0]);
      data.forEach((row) => {
        saveTaxPayerInDatabase(row["NAME"], category, sub_category, row["NTN"]);
      });
      //delete the file which is uploaded in assets folder
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        `/assets/uploads/${req.file.filename}`
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("error====>", err);
          return;
        }
      });
    }

    res.status(200).json({
      message: `Tax Payer created successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveTaxPayerInDatabase = async (name, category, sub_category, ntn) => {
  const taxPayer = new taxPayerModel({
    name,
    category,
    sub_category,
    ntn,
  });
  await taxPayer.save();
};

exports.getAllTaxPayers = async (req, res) => {
  try {
    await entityController.getAllEntities(
      taxPayerModel,
      false,
      req,
      res,
      "category,sub_category"
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTaxPayer = async (req, res) => {
  try {
    await entityController.deleteEntity(taxPayerModel, "Tax Payer", req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaxPayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, sub_category, ntn } = req.body;

    const existingTaxPayer = await taxPayerModel.findById(id);
    if (!existingTaxPayer) {
      return res
        .status(404)
        .json({ message: `Tax Payer with that id does not exist` });
    }
    existingTaxPayer.name = name || existingTaxPayer.name;
    existingTaxPayer.ntn = ntn || existingTaxPayer.ntn;
    existingTaxPayer.category = category || existingTaxPayer.category;
    existingTaxPayer.sub_category =
      sub_category || existingTaxPayer.sub_category;
    await existingTaxPayer.save();

    res.status(200).json({
      message: `Tax Payer updated successfully`,
      data: existingTaxPayer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaxPayersBasedOnMultipleCategoriesAndSubCategories = async (
  req,
  res
) => {
  try {
    const { categories, subCategories } = req.query;
    const categoryIds = categories.split(",");
    const subCategoryIds = subCategories.split(",");
    if (categories && subCategories) {
      const taxPayers = await taxPayerModel
        .find({
          sub_category: { $in: subCategoryIds },
          occupied: 0,
        })
        .populate("category")
        .populate("sub_category");

      res.status(200).json({
        data: taxPayers,
      });
    } else {
      res.status(200).json({
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUnAssociatedEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      associated: null,
      role: { $ne: "Admin" },
    });

    res.status(200).json({
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllUserDeskHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalEntities = await deskHistoryModel.countDocuments();
    const totalPages = Math.ceil(totalEntities / limit);

    const deskHistory = await deskHistoryModel
      .find()
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

exports.getAllUserTaskHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalEntities = await taskHistoryModel.countDocuments();
    const totalPages = Math.ceil(totalEntities / limit);

    const taskHistory = await taskHistoryModel
      .find()
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
