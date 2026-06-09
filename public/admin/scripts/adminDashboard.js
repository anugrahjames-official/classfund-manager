import { collection, query, where, getDocs, orderBy, increment, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../../js/services/firebase.js";
import { find_balance } from "../../js/services/balance.js"
import { get_total_expense } from "../../js/services/expense.js";

async function loadData() {

    document.getElementById("total-balance").textContent = await find_balance()
    document.getElementById('total-expenses').textContent = await get_total_expense()


}
async function loadUsers() {

    const tbody = document.getElementById('student-table');
    const usersRef = collection(db, 'users')
    const minAmount = parseFloat(document.getElementById('min-amount').value) || 0;
    let count = 0

    try {
        console.log("clicked")
        const q = query(usersRef, orderBy("rollNo", "asc"));
        const querySnapshot = await getDocs(q);

        console.log("frrrr")
        tbody.textContent = ""
        querySnapshot.forEach((doc) => {
            const data = doc.data()


            if (data.totalPaid < minAmount) {
                const row = document.createElement("tr");

                const rollNoCell = document.createElement("td");
                rollNoCell.textContent = data.rollNo;

                const nameCell = document.createElement("td");
                nameCell.textContent = data.name;

                const paidCell = document.createElement("td");
                paidCell.textContent = `₹${data.totalPaid}`;

                const dueCell = document.createElement("td");
                dueCell.textContent = minAmount - data.totalPaid;

                row.append(rollNoCell, nameCell, paidCell, dueCell);
                tbody.appendChild(row);
                count++
            }



        })

        document.getElementById("count-below").textContent = count

    } catch (err) {
        console.log(err)
    }

}



// function openModal() {
//     document.getElementById('expense-modal').style.display = 'flex';
// }

// function closeModal() {
//     document.getElementById('expense-modal').style.display = 'none';
// }



document.getElementById("filter-btn").addEventListener("click", loadUsers)

loadData()