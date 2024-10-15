import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.get("/get", getCart);

export default router;
