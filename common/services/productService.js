// productService.js
import Product from "../models/products.schema.js";

export const getAllProducts = async () => await Product.find();

export const getProductsByCategory = async (category) =>
  await Product.find({ category: { $regex: `^${category}$`, $options: "i" } });

export const getProductById = async (id) => await Product.findById(id);

export const addProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};
