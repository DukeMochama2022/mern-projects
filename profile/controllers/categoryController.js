const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "The category already exists!" });
    }

    const newCategory = new Category({
      name,
      description,
    });

    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successifully!",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//getting all categories
const getCategories= async(req,res)=>{
  try {
    const categories=await Category.find()
    res.status(200).json({success:true,data:categories})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

//deleting the catgeory
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category  deleted successifully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCategory, deleteCategory,getCategories };
