const express = require("express");
const controller = require("../controllers/shops");
const router = express.Router();
const upload = require("../middleware/multer");
const passport = require("passport");
router.param("shopId", async (req, res, next, shopId) => {
  console.log("hi");
  const shopFound = await controller.fetchShop(shopId, next);
  if (shopFound) {
    req.shop = shopFound;
    console.log(req.shop);

    next();
  } else {
    console.log("bey");
    const error = new Error("Shop Not Found");
    error.status = 404;
    next(error);
  }
});

router.get("/", controller.shopList);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.shopCreate
);
router.get("/:shopId", controller.shopDetail);
router.put("/:shopId", upload.single("image"), controller.shopUpdate);
router.delete("/:shopId", controller.shopDelete);

router.post(
  "/:shopId/products",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.productCreate
);

module.exports = router;
