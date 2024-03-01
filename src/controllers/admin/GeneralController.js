const express = require("express");
const roleModel = require("../../models/role");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const existingRole = await roleModel.findOne({ name: name });

    if (!existingRole) {
      const newRole = new roleModel({
        name: name,
      });
      await newRole.save();
      res
        .status(200)
        .json({ message: "Role created successfully", data: newRole });
    } else {
      res.status(500).json({ message: "Role already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    const totalRoles = await roleModel.countDocuments();

    const totalPages = Math.ceil(totalRoles / limit);

    let query = roleModel.find().sort({ createdAt: -1 });

    if (paginatedData) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const roles = await query.exec();
    res.status(200).json({
      data: roles,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await roleModel.findById(id);
    if (!role) {
      return res
        .status(404)
        .json({ message: "Role with that id does not exist" });
    }
    await role.deleteOne();
    res.json({ message: "Role deleted successfully", data: role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const roleExists = await roleModel.findById(id);

    if (!roleExists) {
      return res
        .status(404)
        .json({ message: "Role with that id does not exist" });
    }
    roleExists.name = name || roleExists.name;
    await roleExists.save();
    res
      .status(200)
      .json({ message: "Role updated successfully", data: roleExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
