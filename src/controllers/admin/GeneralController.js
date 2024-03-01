const express = require("express");
const roleModel = require("../../models/role");
const domainModel = require("../../models/domain");
const designationModel = require("../../models/designation");
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
