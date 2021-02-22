const { Shop, Product } = require("../db/models");

exports.fetchShop = async (shopId, next) => {
  try {
    const foundShop = await Shop.findByPk(shopId);
    return foundShop;
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    if (req.user.id === req.shop.userId) {
      if (req.file) {
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } else {
      const err = new Error("Unauthorized !");
      err.status = 401;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};
exports.shopList = async (req, res, next) => {
  console.log("hello");
  try {
    const shops = await Shop.findAll({
      attributes: req.body,
      attributes: { exclude: ["updatedAt", "createdAt"] },

      include: {
        model: Product,
        as: "products",
        attributes: ["id"],
      },
    });
    res.status(200).json(shops);
  } catch (error) {
    next(error);
  }
};

exports.shopCreate = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newShop = await Shop.create(req.body);
    res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.shopDetail = async (req, res, next) => {
  res.status(200).json(req.shop);
};

exports.shopUpdate = async (req, res, next) => {
  if (req.file) {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
  }
  await req.shop.update(req.body);
  res.status(200).json(req.shop);
};

exports.shopDelete = async (req, res, next) => {
  await req.shop.destroy();
  res.status(204).end();
};
