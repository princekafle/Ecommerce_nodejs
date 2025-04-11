import { ROLE_ADMIN } from "../constants/roles.js";
import productService from "../services/productService.js";

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);

  res.json(products);
};

const getProductsByUser = async (req, res) => {
  const products = await productService.getAllProducts(req.query, req.user.id);

  res.json(products);
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found.");

    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const createProduct = async (req, res) => {
  const userId = req.user.id;
  const files = req.files;
  const input = req.body;

  try {
    const data = await productService.createProduct(input, files, userId);

    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id; // yo product ko id
  const user = req.user;
  const files = req.files; // form-data bata aako file haru 
  const input = req.body; // form-data bata aako aru textual user ko data haru

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found.");

    if (product.createdBy != user.id && !user.roles.includes(ROLE_ADMIN)) {
      return res.status(403).send("Access denied");
    }

    const data = await productService.updateProduct(id, input, files);

    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    await productService.deleteProduct(id);

    res.send(`Product delete successful of id: ${id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCategories = async (req, res) => {
  const categories = await productService.getCategories();

  res.json(categories);
};

const getBrands = async (req, res) => {
  const brands = await productService.getBrands();

  res.json(brands);
};

const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  const products = await productService.getAllProducts({category});
  res.json(products);
}

const getProductsByBrand = async (req, res) => {
  const brand = req.params.brand;
  const products = await productService.getAllProducts({brands: brand});
  res.json(products);
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductsByUser,
  getBrands,
  getProductsByCategory,
  getProductsByBrand,
};