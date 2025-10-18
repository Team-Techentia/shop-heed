const express = require("express")
const mongoose = require("mongoose");
const app = express();
const Route = require("./src/Route/routes");
const authRoute = require("./src/Route/authRoute");
const productRoute = require("./src/Route/productRoute");
const adminRoute = require("./src/Route/adminRoute");
const orderRoutes = require("./src/Route/orderRoutes");
const webhookRoutes = require("./src/Route/webhookRoutes");
const categoryRoutes = require("./src/Route/categoryRoute");
const blogRoute = require("./src/Route/blogRoute");
const returnAndExchangeRoute = require("./src/Route/returnAndExchangeRoute");
const promocodeRoutes = require('./src/Route/promocodeRoute'); 
const bannerRoutes = require('./src/Route/bannerRoute'); 
const { scheduleCron } = require("./src/scheduler/token")
const announcementRoute = require('./src/Route/announcement');
const featuredSectionRouter = require('./src/Route/feature');
const imageRoutes = require("./src/Route/routes");
const addressRouter = require("./src/Route/addressRoute.js");

const cors = require("cors");
const reviewRouter = require("./src/Route/reviewRouter.js");
app.use(cors());
require("dotenv").config();
app.use(express.json());
app.use(express.static("uploadImages"))

app.use(express.static("invoices"))



mongoose.set("strictQuery", true)
mongoose.connect(process.env.MONGODB_DATABASE,
  { useNewUrlParser: true, authSource: "admin" }
)
  .then(() => console.log("Mongodb is connect"))
  .catch((error) => console.log(error))
// app.use("/", (req, res) => {
//   res.json({ success: true, message: "" })
// })
app.use("/api/api", Route)
app.use("/api/auth-api", authRoute)
app.use("/api/admin-api", adminRoute)
app.use("/api/product-api", productRoute)
app.use("/api/api/orders", orderRoutes)
app.use("/api/api/webhooks", webhookRoutes)
app.use("/api/api/category", categoryRoutes)
app.use("/api/banner", bannerRoutes);
app.use("/api/api/blog", blogRoute)
app.use("/api/returnAndExchangeRoutes", returnAndExchangeRoute)
app.use("/api/promocode", promocodeRoutes);
app.use("/api/announcement", announcementRoute);
app.use("/api/featured-section", featuredSectionRouter);
app.use("/api", imageRoutes);
app.use("/api/user", addressRouter);
app.use('/api/review', reviewRouter);

//scheduler
scheduleCron()

app.listen(process.env.PORT || 3210, function () {
  console.log("Express app running on port " + (process.env.PORT || 3110));
});

