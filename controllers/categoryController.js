const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) return res
      .status(400)
      .json({ error: "Incomplete request,name and description are required" });
    if (name.length > 30)
      return res.status(400).json({ error: "Invalid name" });
    if (description.length > 200)
      return res.status(400).json({ error: "Invalid description" });

    const category = new Category({ name, description });
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
