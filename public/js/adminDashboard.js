import { collection, query, where, getDocs,orderBy,increment,updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

async function getStudentData(inputRollNo) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("rollNo", "==", inputRollNo));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No student found with that Roll Number.");
      return;
    }

    for (const docSnap of querySnapshot.docs) {
      await updateDoc(docSnap.ref, {
        totalPaid: increment(20)
      });
      console.log(`Updated Roll No: ${inputRollNo}`);
    }

  } catch (error) {
    console.error("Error updating student:", error);
  }
}
async function loadUsers() {

    const tbody = document.getElementById('student-table');
    const usersRef = collection(db, 'users')
    const minAmount = parseFloat(document.getElementById('min-amount').value) || 0;
    let count=0

    try {
        console.log("clicked")
        const q = query(usersRef, orderBy("rollNo", "asc"));
        const querySnapshot = await getDocs(q);

        let users = ``
        console.log("frrrr")
        querySnapshot.forEach((doc) => {
            const data = doc.data()


            if (data.totalPaid < minAmount) {
                users += `<tr> 
            <td> ${data.rollNo} </td> 
            <td> ${data.name} </td> 
            <td> ₹${data.totalPaid} </td> 
            <td> ${minAmount - data.totalPaid} </td> 
          </tr>`
          count++
            }



        })

        tbody.innerHTML = users
        document.getElementById('total-expenses').textContent = await getTotalExpense()
        document.getElementById("count-below").textContent=count

    } catch (err) {
        console.log(err)
    }

}
async function getTotalExpense() {
    const expenseRef = collection(db, 'expenses')
    let totalExpense = 0;
    try {
        const querySnapshot = await getDocs(expenseRef);
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            totalExpense += Number(data.amount)
        })
        console.log("total expense:", totalExpense)
        return totalExpense

    } catch (err) {
        console.log(err)
    }
}




function openModal() {
    document.getElementById('expense-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('expense-modal').style.display = 'none';
}

function saveExpense() {
    const desc = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);

    if (desc && amount > 0) {
        expenses.push({ desc, amount });
        document.getElementById('exp-desc').value = '';
        document.getElementById('exp-amount').value = '';
        closeModal();
        updateTable();
    }
}

document.getElementById("filter-btn").addEventListener("click", loadUsers)

