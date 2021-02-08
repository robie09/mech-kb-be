const express = require("express");
const db = require("./db/models");
const { Product } = require("./db/models");
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  console.log(req.body);
  try {
    const products = await Product.findAll({ attributes: req.body });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productFound = await Product.findByPk(productId);
    if (productFound) res.status(200).json(productFound);
    else res.status(404).json({ message: "Product does not exist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productFound = await Product.findByPk(productId);
    if (productFound) {
      await productFound.update(req.body);
      res.status(200).json(productFound);
    } else res.status(404).json({ message: "Product does not exist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productFound = await Product.findByPk(productId);
    if (productFound) {
      await productFound.destroy();
      res.status(204).end();
    } else res.status(404).json({ message: "Product does not exist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 8000;

db.sequelize.sync();
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
