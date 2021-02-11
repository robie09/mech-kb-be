const express = require("express");
const controller = require("../controllers/products");
const router = express.Router();

router.param("productId", async (req, res, next, productId) => {
  const productFound = await controller.fetchProduct(productId, next);
  if (productFound) {
    req.product = productFound;
    next();
  } else {
    const error = new Error("Product Not Found");
    error.status = 404;
    next(error);
  }
});

router.get("/", controller.productList);
router.post("/", controller.productCreate);
router.get("/:productId", controller.productDetail);
router.put("/:productId", controller.productUpdate);
router.delete("/:productId", controller.productDelete);

module.exports = router;
