import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";


//function returning the total expenses
export async function get_total_expense() {
  const expenseRef = collection(db, 'expenses')
  let totalExpense = 0;
  try {
    const querySnapshot = await getDocs(expenseRef);
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      totalExpense += data.amount
    })

    return totalExpense

  } catch (err) {
    console.log(err)
  }
}

//function for dynamically load the expenses table 
export async function loadExpenses() {
  const expenseRef = collection(db, 'expenses')

  try {
    const querySnapshot = await getDocs(expenseRef);
    let expenses = ``
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      expenses += `<tr> <td> ${data.date} </td> <td> ${data.item} </td>  <td> ${data.amount} </td></tr>`
    })

    console.log(expenses)
    document.getElementById("class-fund-table").innerHTML = expenses

  } catch (err) {
    console.log(err)
  }

}

