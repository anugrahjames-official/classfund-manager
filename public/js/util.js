import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";
import { get_total_expense } from "./expense.js";

export async function find_balance() {
  let totalCollected = await get_total_collected()
  let totalExpense = await get_total_expense()

  return totalCollected - totalExpense

}

async function get_total_collected() {
  const expenseRef = collection(db, 'users')

  try {
    const querySnapshot = await getDocs(expenseRef);
    let total = 0
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      total += Number(data.totalPaid)

    })
    return total


  } catch (err) {
    console.log(err)
  }

}

