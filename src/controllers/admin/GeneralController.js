const express = require("express");
const roleModel = require("../../models/role");
const domainModel = require("../../models/domain");
const designationModel = require("../../models/designation");
const taskModel = require("../../models/task")
const teamModel = require("../../models/team")
const gradeModel = require("../../models/grade")
const entityController = require("../../utils/entityController");

exports.createRole = async (req, res) => {
  await entityController.createEntity(roleModel, "Role", false, req, res);
};

exports.getAllRoles = async (req, res) => {
  await entityController.getAllEntities(roleModel, false, req, res);
};

exports.deleteRole = async (req, res) => {
  await entityController.deleteEntity(roleModel, "Role", req, res);
};

exports.updateRole = async (req, res) => {
  await entityController.updateEntity(roleModel, "Role", false, req, res);
};

//domains
exports.createDomain = async (req, res) => {
  await entityController.createEntity(domainModel, "Domain", true, req, res);
};

exports.getAllDomains = async (req, res) => {
  await entityController.getAllEntities(domainModel, true, req, res);
};

exports.deleteDomain = async (req, res) => {
  await entityController.deleteEntity(domainModel, "Domain", req, res);
};

exports.updateDomain = async (req, res) => {
  await entityController.updateEntity(domainModel, "Domain", true, req, res);
};

//designations
exports.createDesignation = async (req, res) => {
  await entityController.createEntity(
    designationModel,
    "Designation",
    true,
    req,
    res
  );
};

exports.getAllDesignations = async (req, res) => {
  await entityController.getAllEntities(designationModel, true, req, res);
};

exports.deleteDesignation = async (req, res) => {
  await entityController.deleteEntity(
    designationModel,
    "Designation",
    req,
    res
  );
};

exports.updateDesignation = async (req, res) => {
  await entityController.updateEntity(
    designationModel,
    "Designation",
    true,
    req,
    res
  );
};

//tasks
exports.createTask = async (req, res) => {
  await entityController.createEntity(taskModel, "Task", false, req, res);
};

exports.getAllTasks = async (req, res) => {
  await entityController.getAllEntities(taskModel, false, req, res);
};

exports.deleteTask = async (req, res) => {
  await entityController.deleteEntity(taskModel, "Task", req, res);
};

exports.updateTask = async (req, res) => {
  await entityController.updateEntity(taskModel, "Task", false, req, res);
};

//grade
exports.createGrade = async (req, res) => {
  await entityController.createEntity(gradeModel, "Grade", false, req, res);
};

exports.getAllGrades = async (req, res) => {
  await entityController.getAllEntities(gradeModel, false, req, res);
};

exports.deleteGrade = async (req, res) => {
  await entityController.deleteEntity(gradeModel, "Grade", req, res);
};

exports.updateGrade = async (req, res) => {
  await entityController.updateEntity(gradeModel, "Grade", false, req, res);
};

//team
exports.createTeam = async (req, res) => {
  await entityController.createEntity(teamModel, "Team", false, req, res);
};

exports.getAllTeams = async (req, res) => {
  await entityController.getAllEntities(teamModel, false, req, res);
};

exports.deleteTeam = async (req, res) => {
  await entityController.deleteEntity(teamModel, "Team", req, res);
};

exports.updateTeam = async (req, res) => {
  await entityController.updateEntity(teamModel, "Team", false, req, res);
};