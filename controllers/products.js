const { Product, Shop } = require("../db/models");

exports.fetchProduct = async (productId, next) => {
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
    const products = await Product.findAll({
      attributes: req.body,
      attributes: { exclude: ["updatedAt", "createdAt"] },

      include: {
        model: Shop,
        as: "shops",
        attributes: ["id"],
      },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.productDetail = async (req, res, next) => {
  res.status(200).json(req.product);
};

exports.productUpdate = async (req, res, next) => {
  const foundShop = await Shop.findByPk(req.product.shopId);

  if (req.user.id === foundShop.userId) {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    await req.product.update(req.body);
    res.status(200).json(req.product);
  } else {
    const err = new Error("Unauthorized !");
    err.status = 401;
    next(err);
  }
};

exports.productDelete = async (req, res, next) => {
  const foundShop = await Shop.findByPk(req.product.shopId);

  if (req.user.id === foundShop.userId) {
    await req.product.destroy();
    res.status(204).end();
  } else {
    const err = new Error("Unauthorized !");
    err.status = 401;
    next(err);
  }
};
