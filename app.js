const express = require("express");
const db = require("./db/models");
const productRoutes = require("./routes/products");
const app = express();
app.use(express.json());

app.use("/products", productRoutes);

app.use((req, res, next) => {
  const error = new Error("Path Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message || "Internal Server Error" });
});

const PORT = 8000;
db.sequelize.sync();
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
