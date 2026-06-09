import { collection, query, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../../js/services/firebase.js";

async function loadTransactions() {
    const transactionsRef = collection(db, 'transactions')

    try {
        const q = query(transactionsRef, orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const tableBody = document.getElementById("class-fund-table2");
        tableBody.textContent = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : "—";

            const rollNoCell = document.createElement("td");
            rollNoCell.textContent = data.rollNo ?? "—";

            const amountCell = document.createElement("td");
            amountCell.textContent = data.amount ?? "—";

            const statusCell = document.createElement("td");
            statusCell.textContent = data.status ?? "—";

            row.append(dateCell, rollNoCell, amountCell, statusCell);
            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error(err)
    }

}
loadTransactions()
