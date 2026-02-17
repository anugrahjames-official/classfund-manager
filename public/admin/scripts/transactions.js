import { collection, query, where, getDocs, orderBy, increment, updateDoc,doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../../js/services/firebase.js";
import { getStudentData } from "./updateUser.js"

async function loadExpenses() {
    const transactionsRef = collection(db, 'transactions')

    try {
        const querySnapshot = await getDocs(transactionsRef);
        let expenses = ``
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;

            if (data.status === "pending") {
                expenses += `
            <tr> 
                <td> ${data.createdAt.toDate().toLocaleDateString()} </td> 
                <td> ${data.name} </td>  
                <td> ${data.status} </td>
                <td> 
                    <button class="approve-btn" 
                            data-id="${id}" 
                            data-roll="${data.name}" 
                            >
                        Approve
                    </button> 
                </td>
            </tr>`;
            }
        });

        document.getElementById("class-fund-table2").innerHTML = expenses

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
