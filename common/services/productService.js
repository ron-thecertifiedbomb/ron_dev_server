// productService.js
import Product from "../models/products.schema.js";

// all products
export const getAllProducts = async () => await Product.find();

//  product
export const getProductById = async (id) => await Product.findById(id);

//products by category
export const getProductsByCategory = async (category) =>
  await Product.find({ category: { $regex: `^${category}$`, $options: "i" } });


export const addProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};
