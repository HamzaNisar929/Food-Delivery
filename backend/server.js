import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import connectDB from "./database/connectDB.js";
import morgan from "morgan";

import authRouter from "./routes/authRoutes.js";
import foodRouter from "./routes/foodRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

const corsOptions = {
  origin: true, // Replace with your frontend URL
  credentials: true, // Allows cookies to be sent in requests
};

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/images", express.static("uploads"));
app.use("/api/food", foodRouter);
app.use("/api/user", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
