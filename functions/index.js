import dotenv from "dotenv";
dotenv.config();

import {initializeApp} from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";


const app = express();
app.use(cors());
app.use(express.json());


initializeApp();
const db = getFirestore()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.post("/create-order", async (req, res) => {
    console.log("Create order request received with body:", req.body)
  const { amount, rollNo } = req.body;
  
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
      
      // Find the transaction by orderId and update status
      const snapshot = await db.collection("transactions")
        .where("orderId", "==", razorpay_order_id)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({
          status: "success",
          paymentId: razorpay_payment_id,
        });
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

export const api = onRequest(app);