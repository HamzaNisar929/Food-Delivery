import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    // Save order details in the database
    const newOrder = new orderModel({
      userId: req.user._id, // Assuming req.user is set via middleware
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Empty the user's cart after placing the order
    await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });

    // Create Stripe line items for the checkout session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: { name: item.name },
        unit_amount: item.price * 100 * 277, // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "pkr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100 * 277,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Respond with the session URL for the user to proceed with payment
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in placeOrder controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
