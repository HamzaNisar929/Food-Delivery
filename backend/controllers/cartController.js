import { response } from "express";
import userModel from "../models/userModel.js";

//add items to cart
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.body;
  try {
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData || {}; // Initialize if undefined
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log("error in addToCart controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//remove items from users cart
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  try {
    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log("error in removeFromCart controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//fetch user cart data
export const getCart = async (req, res) => {
  const userId = req.user._id;
  try {
    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("error in getCart controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
