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

app.post("/create-order", verifyToken, async (req, res) => {
  const { rollNo } = req.body;
  if(req.roll_no !== rollNo){
    return res.status(403).json({ error: "Unauthorized: Roll number mismatch" });
  }
  try {
    // The class fund contribution is fixed at ₹20 for this app.
    const amountRupees = 20;
    const amountPaise = amountRupees * 100;
    const options = {
      amount: amountPaise,
      currency: "INR",
    };
    
    const order = await razorpay.orders.create(options);

    await db.collection("transactions").doc(order.id).set({
      rollNo,
      status: "pending",
      orderId: order.id,
      amount: amountRupees,
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(200).json({ orderId: order.id, amount: amountPaise });
    
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
      const transactionRef = db.collection("transactions").doc(razorpay_order_id);
      const result = await db.runTransaction(async (transaction) => {
        const transactionSnap = await transaction.get(transactionRef);

        if (!transactionSnap.exists) {
          return { status: "not_found" };
        }

        const transactionData = transactionSnap.data();

        if (transactionData.status !== "pending") {
          return { status: "already_processed" };
        }

        const usersQuery = db.collection("users")
          .where("rollNo", "==", transactionData.rollNo)
          .limit(1);
        const usersSnapshot = await transaction.get(usersQuery);

        if (usersSnapshot.empty) {
          throw new Error(`No user found for rollNo: ${transactionData.rollNo}`);
        }

        const userRef = usersSnapshot.docs[0].ref;
        transaction.update(transactionRef, {
          status: "success",
          paymentId: razorpay_payment_id,
        });
        transaction.update(userRef, {
          totalPaid: FieldValue.increment(transactionData.amount)
        });

        return { status: "success" };
      });

      if (result.status === "success") {
        return res.status(200).json({ status: "success", message: "Payment verified successfully" });
      }

      if (result.status === "already_processed") {
        return res.status(200).json({ status: "success", message: "Payment already verified" });
      }

      return res.status(404).json({ status: "failure", message: "Transaction not found" });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const api = onRequest({cors: true}, app);