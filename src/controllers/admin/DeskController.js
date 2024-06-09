const workingGroupModel = require("../../models/working-group");
const userModel = require("../../models/user");
const deskModel = require("../../models/desk");

exports.createDesk = async (req, res) => {
  try {
    const { name, working_group } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    const desk = new deskModel({
      name,
      slug,
      // employee,
      working_group,
      // job_description,
    });
    await desk.save();
    // employee.forEach(async (user_id) => {
    //   const employeeDetail = await userModel.findById(user_id);
    //   console.log(employeeDetail);
    //   if (employeeDetail) {
    //     employeeDetail.associated = desk._id;
    //     await employeeDetail.save();
    //   }
    // });

    working_group.forEach(async (group_id) => {
      const groupDetail = await workingGroupModel.findById(group_id);
      if (groupDetail) {
        groupDetail.associated = desk._id;
        await groupDetail.save();
      }
    });

    res.status(200).json({
      message: `Desk created successfully`,
      data: desk,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDesks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalGroups = await deskModel.countDocuments();

    const totalPages = Math.ceil(totalGroups / limit);

    const desks = await deskModel
      .find()
      .populate("working_group")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: desks,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDetailOfDeskById = async (req, res) => {
  try {
    const deskId = req.params.deskId;
    const desk = await deskModel
      .findById(deskId)
      .populate("working_group");

    res.status(200).json({
      data: desk,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
