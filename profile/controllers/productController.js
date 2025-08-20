const Product = require("../models/Product");

//create a new product

const createProduct = async (req, res) => {
  try {
    const { businessName, location, productsOffered, owner } = req.body;
    if (!businessName || !location || !productsOffered) {
      return res
        .status(400)
        .json({ success: false, message: "provide all credentials!" });
    }

    const newProduct = new Product({
      owner: req.user.id,
      businessName,
      location,
      productsOffered,
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product created successifuly!",
      data: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product!", error: error.message });
  }
};

//get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res
        .status(404)
        .json({ success: true, message: "No products found!" });
    }
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product!", error: error.message });
  }
};

// get product by id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: true, message: "Product not found!" });
    }
    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product!", error: error.message });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: true, message: "Product not found!" });
    }

    //ensure that the admins/vendors  manage their own products
    if (
      req.user.role !== "admin" &&
      product.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only!",
      });
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product!", error: error.message });
  }
};

// delete a product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: true, message: "Product not found!" });
    }

    //ensure that the admins/vendors  manage their own products
    if (
      req.user.role !== "admin" &&
      product.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only!",
      });
    }

    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product!", error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
