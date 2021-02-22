const express = require("express");
const db = require("./db/models");
const productRoutes = require("./routes/products");
const shopRoutes = require("./routes/shops");
const userRoutes = require("./routes/users");
const { localStrategy, jwtStrategy } = require("./middleware/passport");

const cors = require("cors");
const path = require("path");

const passport = require("passport");

const app = express();
app.use(express.json());
app.use(cors());

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

//Routers
app.use("/products", productRoutes);
app.use("/shops", shopRoutes);
app.use(userRoutes);
app.use("/media", express.static(path.join(__dirname, "media")));

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
db.sequelize.sync({ alter: true });
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
