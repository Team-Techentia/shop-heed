const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ROUTES
const userAuthRoute = require("./src/Route/authRoute");
const adminAuthRoute = require("./src/Route/adminAuthRoutes"); // NEW
const adminRoute = require("./src/Route/adminRoute");
const productRoute = require("./src/Route/productRoute");
const orderRoutes = require("./src/Route/orderRoutes");
const webhookRoutes = require("./src/Route/webhookRoutes");
const categoryRoutes = require("./src/Route/categoryRoute");
const blogRoute = require("./src/Route/blogRoute");
const returnAndExchangeRoute = require("./src/Route/returnAndExchangeRoute");
const promocodeRoutes = require("./src/Route/promocodeRoute");
const bannerRoutes = require("./src/Route/bannerRoute");
const announcementRoute = require("./src/Route/announcement");
const featuredSectionRouter = require("./src/Route/feature");
const addressRouter = require("./src/Route/addressRoute");
const reviewRouter = require("./src/Route/reviewRouter");

// MIDDLEWARE

const { scheduleCron } = require("./src/scheduler/token");

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static("uploadImages"));
app.use(express.static("invoices"));

// DB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_DATABASE, {
    useNewUrlParser: true,
    authSource: "admin",
  })
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// -------------------- ROUTES -------------------- //

// ✅ USER AUTH (OTP)
app.use("/api/auth-api", userAuthRoute);

// ✅ ADMIN AUTH (LOGIN / REGISTER) — NO TOKEN REQUIRED
app.use("/api/admin-auth", adminAuthRoute);

// 🔐 ADMIN PROTECTED ROUTES
app.use("/api/admin-api", adminRoute);

// OTHER APIs
app.use("/api/product-api", productRoute);
app.use("/api/api/orders", orderRoutes);
app.use("/api/api/webhooks", webhookRoutes);
app.use("/api/api/category", categoryRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/api/blog", blogRoute);
app.use("/api/returnAndExchangeRoutes", returnAndExchangeRoute);
app.use("/api/promocode", promocodeRoutes);
app.use("/api/announcement", announcementRoute);
app.use("/api/featured-section", featuredSectionRouter);
app.use("/api/user", addressRouter);
app.use("/api/review", reviewRouter);

// CRON
scheduleCron();

// SERVER
app.listen(process.env.PORT || 3210, () => {
  console.log("Server running on port " + (process.env.PORT || 3210));
});
