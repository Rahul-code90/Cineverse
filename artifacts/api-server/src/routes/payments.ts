import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();

// Initialize Razorpay with placeholders fallback so local dev without keys doesn't crash on startup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    
    // In test mode with dummy keys, Razorpay SDK fails to reach API
    if (process.env.RAZORPAY_KEY_ID === undefined) {
      // Return a simulated order if no real keys are configured
      console.log("Simulating Razorpay Create Order...");
      res.json({
        id: "order_mock_" + Date.now(),
        amount: amount * 100, // amount in paise
        currency,
        status: "created",
      });
      return;
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: "rcpt_" + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET || "secret_placeholder";
    
    // If we're mocking, auto-verify
    if (razorpay_order_id.startsWith("order_mock_")) {
       res.json({ success: true, message: "Payment verified successfully (mock)" });
       return;
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment is verified successfully
      // Here you would typically update the database booking status to 'confirmed'
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal server error during verification" });
  }
});

export default router;
