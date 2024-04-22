const categoryModel = require("../../models/category");
const subCategoryModel = require("../../models/sub-category");
const entityController = require("../../utils/entityController");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");
    const category = new categoryModel({ name, slug });
    await category.save();

    res.status(200).json({
      message: `Cateogry created successfully`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategries = async (req, res) => {
  try {
    await entityController.getAllEntities(categoryModel, false, req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await entityController.deleteEntity(categoryModel, "Category", req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: `Category with that id does not exist` });
    }
    existingCategory.name = name || existingCategory.name;
    existingCategory.slug = slug || existingCategory.slug;
    await existingCategory.save();

    res.status(200).json({
      message: `Cateogry updated successfully`,
      data: existingCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");
    const subCategory = new subCategoryModel({ name, slug, category });
    await subCategory.save();

    res.status(200).json({
      message: `Sub Cateogry created successfully`,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSubCategries = async (req, res) => {
  try {
    await entityController.getAllEntities(
      subCategoryModel,
      false,
      req,
      res,
      "category"
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    await entityController.deleteEntity(
      subCategoryModel,
      "Sub Category",
      req,
      res
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    const existingSubCategory = await subCategoryModel.findById(id);
    if (!existingSubCategory) {
      return res
        .status(404)
        .json({ message: `Sub Category with that id does not exist` });
    }
    existingSubCategory.name = name || existingSubCategory.name;
    existingSubCategory.slug = slug || existingSubCategory.slug;
    existingSubCategory.category = category || existingSubCategory.category;
    await existingSubCategory.save();

    res.status(200).json({
      message: `Sub Cateogry updated successfully`,
      data: existingSubCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubCategoriesBasedOnMultipleCategories = async (req, res) => {
  try {
    const { categories } = req.query;
    const categoryIds = categories.split(",");
    if (categories) {
      const subCategories = await subCategoryModel
        .find({
          category: { $in: categoryIds },
        })
        .populate("category");

      res.status(200).json({
        data: subCategories,
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
