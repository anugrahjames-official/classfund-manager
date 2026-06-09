import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

export async function createPendingDocument(username) {
  try {
    const colRef = collection(db, "transactions");

    const docRef = await addDoc(colRef, {
      name: username,
      status: "pending",
      createdAt: serverTimestamp()
    });

      console.info("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};