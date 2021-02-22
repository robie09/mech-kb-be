const express = require("express");
const controller = require("../controllers/products");
const router = express.Router();
const upload = require("../middleware/multer");
const passport = require("passport");

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
router.get("/:productId", controller.productDetail);
router.put(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.productUpdate
);
router.delete(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  controller.productDelete
);

module.exports = router;
