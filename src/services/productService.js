// Database related tasks
import { formatProductData } from "../helpers/dataFormatter.js";
import Product from "../models/Product.js";
import uploadFile from "../utils/file.js";
import promptGemini from "../utils/gemini.js";

// 1. Sort: {fieldName:ORDER} for e.g {price: -1} 1: ASC | -1: DESC
// 2. Limit: Max no. of items

const getAllProducts = async (query, userId) => {
  const sort = JSON.parse(query.sort || "{}");
  const limit = query.limit;
  const offset = query.offset;
  const filters = {};

  const { category, brands, name, min, max } = query;
// if category is provided then it set filters.category = category
  if (category) filters.category = category;
  // If brands exist, it splits the string by commas (e.g., "Nike,Adidas" → ["Nike", "Adidas"]) and uses MongoDB’s $in operator to filter products where brand is one of these values.
  if (brands) {
    const brandItems = brands.split(",");
    filters.brand = { $in: brandItems };
  }
  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }
//   If min is given, it sets price to greater than or equal ($gte) to min.

// If max is given, it adds a condition for less than or equal ($lte) to max.
  if (min) filters.price = { $gte: parseFloat(min) };
  if (max)
    filters.price = {
      ...filters.price,
      $lte: parseFloat(max),
    };

  if (userId) filters.createdBy = userId;

  const products = await Product.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(offset);

  return products;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
 const geminiResponse = await promptGemini(product); // gemini bata aako response lai product ko description ma halne
  return formatProductData(product, geminiResponse); 
};

const createProduct = async (data, files, userId) => {
  const uploadedFiles = await uploadFile(files);

  return await Product.create({
    ...data,
    createdBy: userId,
    imageUrls: uploadedFiles.map((item) => item?.url),
  });
};

const updateProduct = async (id, data, files) => {
  const updateData = data;

  if (files?.length > 0) {
    const uploadedFiles = await uploadFile(files);
    updateData.imageUrls = uploadedFiles.map((item) => item?.url);
  }

  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const deleteProduct = async (id) => {
  await Product.findByIdAndDelete(id);
};

const getCategories = async () => {
  return await Product.distinct("category");
};

const getBrands = async () => {
  return await Product.distinct("brand");
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
};
