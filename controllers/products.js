const { Product } = require("../db/models");

const fetchProduct = async (productId, next) => {
  try {
    const productFound = await Product.findByPk(productId);
    if (productFound) return productFound;
    else next({ message: "Product does not exist" });
  } catch (error) {
    next(error);
  }
};

exports.productList = async (req, res, next) => {
  console.log(req.body);
  try {
    const products = await Product.findAll({ attributes: req.body });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.productDetail = async (req, res, next) => {
  res.status(200).json(req.product);
};

exports.productUpdate = async (req, res, next) => {
  await req.product.update(req.body);
  res.status(200).json(req.product);
};

exports.productDelete = async (req, res, next) => {
  await req.product.destroy();
  res.status(204).end();
};
