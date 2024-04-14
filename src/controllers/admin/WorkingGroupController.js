const workingGroupModel = require("../../models/working-group");
const taxPayerModel = require("../../models/tax-payer");

exports.createWorkingGroup = async (req, res) => {
  try {
    const { name, category, sub_category, tax_payer } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    tax_payer.forEach(async (user_id) => {
      const taxPayerDetail = await taxPayerModel.findById(user_id);
      if (taxPayerDetail) {
        taxPayerDetail.occupied = 1;
        await taxPayerDetail.save();
      }
    });

    const group = new workingGroupModel({
      name,
      slug,
      category,
      sub_category,
      tax_payer,
    });
    await group.save();

    res.status(200).json({
      message: `Group created successfully`,
      data: group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllWorkingGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalGroups = await workingGroupModel.countDocuments();

    const totalPages = Math.ceil(totalGroups / limit);

    const workingGroups = await workingGroupModel
      .find()
      .populate("category")
      .populate("sub_category")
      .populate("tax_payer")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: workingGroups,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
