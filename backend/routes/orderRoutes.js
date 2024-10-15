import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.use(protectRoute);
router.post("/place", placeOrder);

export default router;
