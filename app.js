require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const { ExpressError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const drinkRoutes = require("./routes/drinkRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/drink", drinkRoutes);
app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/drink", drinkRoutes);
app.use("/api/test", testRoutes);

app.use("/api/*", (req, res, next) => {
  const error = new ExpressError("Resource not Found", 404);
  next(error);
});

app.use(express.static(path.join(__dirname, "client/build")));

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Server Error";
  return res.status(status).send({ message });
});

module.exports = app;
