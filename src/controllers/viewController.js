import productService from "../services/productService.js";

const homePage = (req, res) => {
  res.render("home", { username: "James" });
};

const productsPage = async (req, res) => {
  const products = await productService.getAllProducts(req.query);  // yesle sabai products fetch garxa databse bata 

  res.render("products", { products }); // products.hbs khulxa products controller call huda route ma 
};

const productByIdPage = async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.render("product", { product });
};

export { homePage, productsPage, productByIdPage };