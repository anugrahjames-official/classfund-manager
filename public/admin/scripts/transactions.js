import { collection, query, where, getDocs, orderBy, increment, updateDoc,doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../../js/services/firebase.js";
import { getStudentData } from "./updateUser.js"

async function loadExpenses() {
    const transactionsRef = collection(db, 'transactions')

    try {
        const querySnapshot = await getDocs(transactionsRef);
        const tableBody = document.getElementById("class-fund-table2");
        tableBody.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;

            if (data.status === "pending") {
                const row = document.createElement("tr");

                const dateCell = document.createElement("td");
                dateCell.textContent = data.createdAt.toDate().toLocaleDateString();

                const nameCell = document.createElement("td");
                nameCell.textContent = data.name;

                const statusCell = document.createElement("td");
                statusCell.textContent = data.status;

                const actionCell = document.createElement("td");
                const button = document.createElement("button");
                button.className = "approve-btn";
                button.dataset.id = id;
                button.dataset.roll = data.name;
                button.textContent = "Approve";

                actionCell.appendChild(button);
                row.append(dateCell, nameCell, statusCell, actionCell);
                tableBody.appendChild(row);
            }
        });

    } catch (err) {
        console.log(err)
    }

}
loadExpenses()


const tableBody = document.getElementById("class-fund-table2");

tableBody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('approve-btn')) {
        const btn = event.target;
        
        const transactionId = btn.getAttribute('data-id');
        const rollNo = btn.getAttribute('data-roll');

        console.log(`Approving: (Roll: ${rollNo})`);
        
        await handleApproval(transactionId, Number(rollNo));
    }
});
async function handleApproval(transactionId, rollNo) {
    try {
        const transRef = doc(db, 'transactions', transactionId);
        await updateDoc(transRef, { status: "success" });
        console.log("type of the roll no ", typeof rollNo)
        alert("Status updated and total added!");
        await getStudentData(rollNo)
        loadExpenses(); 

    } catch (error) {
        console.error("Error during approval:", error);
    }
}
