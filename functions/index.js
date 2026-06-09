import {initializeApp} from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.js";
dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyToken);


initializeApp();
const db = getFirestore()

const razorpay = new Razorpay({
  // If process.env is missing during deployment, use a placeholder string so it doesn't crash
  key_id: process.env.RAZORPAY_KEY_ID || "deployment_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "deployment_placeholder"
});

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.post("/create-order", async (req, res) => {
    console.log("Create order request received with body:", req.body)
    console.log("Authenticated user info:", req.user) // Log decoded token info from middleware
  const { uid, email } = req.user;
  const { amount, rollNo } = req.body;
  if(req.roll_no !== rollNo){
    return res.status(403).json({ error: "Unauthorized: Roll number mismatch" });
  }
  try {
    const options = {
      amount,
      currency: "INR",
    };
    
    const order = await razorpay.orders.create(options);

    await db.collection("transactions").add({
      rollNo,
      status: "pending",
      orderId: order.id,
      amount,
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(200).json({ orderId: order.id, amount });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      const snapshot = await db.collection("transactions")
        .where("orderId", "==", razorpay_order_id)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const transactionDoc = snapshot.docs[0];
        const { rollNo, amount } = transactionDoc.data(); // grab rollNo + amount

        // 1. Mark transaction as success
        await transactionDoc.ref.update({
          status: "success",
          paymentId: razorpay_payment_id,
        });

        // 2. Increment totalPaid on the matching user
        const usersSnapshot = await db.collection("users")
          .where("rollNo", "==", rollNo)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          await usersSnapshot.docs[0].ref.update({
            totalPaid: FieldValue.increment(amount / 100) // amount is in paise, convert to ₹
          });
          console.log(`totalPaid incremented for rollNo: ${rollNo}`);
        } else {
          console.warn(`No user found for rollNo: ${rollNo}`);
        }
      }

      res.status(200).json({ status: "success", message: "Payment verified successfully" });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const api = onRequest({cors: true}, app);