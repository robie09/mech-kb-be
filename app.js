const express = require("express");
let products = require("./data");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json(products);
});

app.post("/", (req, res) => {
  const newProduct = {
    id: products[products.length - 1].id + 1,
    ...req.body,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/:productId", (req, res) => {
  const { productId } = req.params;
  const productFound = products.find((product) => product.id === +productId);
  if (productFound) res.status(200).json(productFound);
  else res.status(404).json({ message: "Product not found" });
});

app.delete("/:productId", (req, res) => {
  const { productId } = req.params;
  const productFound = products.find((product) => product.id === +productId);
  if (productFound) {
    products = products.filter((product) => product !== productFound);
    res.status(204).end();
  } else res.status(404).json({ message: "Product not found" });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
