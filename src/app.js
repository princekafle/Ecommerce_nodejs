import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import connectDB from "./config/database.js";
import logger from "./middlewares/logger.js";
import authRoute from "./routes/authRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import multer from "multer";
import orderRoute from "./routes/orderRoute.js";
import viewRoute from './/routes/viewRoute.js'
dotenv.config();

const app = express();
connectDB();
connectCloudinary(); // for media files store to cloudinary
const upload = multer({
  // dest: "uploads/", // yesle chai euta upload vanne file banaera tesma file store garxa yei folder ma locallacy 
  storage: multer.memoryStorage(), // yesle chai file lai ram memory ma temporarily store garxa
});
app.use(logger); // hamile yaha logger middleware lai global level ma use gareko xau but yeslai hamile specific route ma ni use garna sakinxa

// yesle chai hamile json data lai parse garera req.body ma store garxa
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "hbs");
const port = process.env.PORT || 5000;



app.get("/", (req, res) => {
  res.json({
    name:"E-commerce API",
    description: "This is a E-commerce API",
    status: "OK",
    version: "1.1.0",
    url: "https://ecommerce-nodejs-five.vercel.app/",
    port: port,
  });
});



app.use("/api/products", upload.array("images", 5), productRoutes);
// jabasamma hamile upload.single use gardainau yesari taba samma req.file ma hamile postman bata upload gareko file aaudaina 
app.use("/api/users", upload.single("image"), userRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", orderRoute);
app.use("/page", viewRoute);



app.listen(port, () => { 
  console.log(`Server started at port ${port}...`);
});
