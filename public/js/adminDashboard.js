import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";


async function loadUsers() {
    
    const tbody = document.getElementById('student-table');
    const usersRef = collection(db, 'users')
    const minAmount = parseFloat(document.getElementById('min-amount').value) || 0;


    try {
        console.log("clicked")
        const querySnapshot = await getDocs(usersRef);
       
        let users = ``
        console.log("frrrr")
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            
           

                users += `<tr> 
            <td> ${data.rollNo} </td> 
            <td> ${data.name} </td> 
            <td> ₹${data.totalPaid} </td> 
            <td> ${minAmount - data.totalPaid} </td> 
          </tr>`
            

        })

        tbody.innerHTML = users
        document.getElementById('total-expenses').textContent  = await getTotalExpense()

    } catch (err) {
        console.log(err)
    }

}
async function getTotalExpense(){
    const expenseRef=collection(db,'expenses')
    let totalExpense=0;
    try{
        const querySnapshot = await getDocs(expenseRef);
        querySnapshot.forEach((doc)=>{
            const data=doc.data()
            totalExpense+= Number(data.amount)
        })
        console.log("total expense:",totalExpense)
        return totalExpense
        
    }catch(err){
        console.log(err)
    }
}

const students = [
    { id: "21BCE001", name: "Aarav Sharma", paid: 1000 },
    { id: "21BCE002", name: "Ananya Iyer", paid: 0 },
    { id: "21BCE003", name: "Ishaan Patel", paid: 100 },
    { id: "21BCE004", name: "Kavya Reddy", paid: 450 },
    { id: "21BCE005", name: "Rohan Das", paid: 750 },
    { id: "21BCE006", name: "Sanya Malhotra", paid: 0 },
    { id: "21BCE007", name: "Vikram Singh", paid: 500 },
    { id: "21BCE008", name: "Zoya Khan", paid: 50 },
    { id: "21BCE009", name: "Aditya Verma", paid: 200 },
    { id: "21BCE010", name: "Meera Nair", paid: 1000 }
];


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