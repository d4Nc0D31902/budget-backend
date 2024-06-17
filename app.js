const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const cash = require("./routes/cash");
const atm = require("./routes/atm");
const income = require("./routes/income");
const expenses = require("./routes/expenses");
const savings = require("./routes/savings");
const transaction = require("./routes/transaction");
const category = require("./routes/category");
const budget = require("./routes/budget");

const errorMiddleware = require("./middlewares/errors");
app.use(express.json({ limit: "100mb" }));
// app.set("trust proxy", 1);
app.use(
  cors({
    // origin: process.env.BACKEND_ORIGIN,
    origin: process.env.LOCAL_URL,
    // origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", cash);
app.use("/api/v1", atm);
app.use("/api/v1", income);
app.use("/api/v1", expenses);
app.use("/api/v1", transaction);
app.use("/api/v1", savings);
app.use("/api/v1", category);
app.use("/api/v1", budget);

app.use(errorMiddleware);
module.exports = app;
