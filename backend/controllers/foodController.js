import foodModel from "../models/foodModel.js";
import fs from "fs";

export const addFood = async (req, res) => {
  const image_filename = `${req.file.filename}`;
  try {
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });
    await food.save();

    res.status(201).json({
      success: true,
      message: "Food item added successfully!",
      data: food,
    });
  } catch (error) {
    console.log("error in addFood controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find();

    res.status(200).json({
      success: true,
      message: "Foods founded successfully!",
      data: foods,
    });
  } catch (error) {
    console.log("error in listFood controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully!",
    });
  } catch (error) {
    console.log("error in removeFood controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
