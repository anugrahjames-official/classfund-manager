import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";
import {navigateToClassFund,navigateToHome,openPayModal,closePayModal} from "./navigations.js"




onAuthStateChanged(auth, (user) => {
  if (user) {
    // 1. Get the username back from the email (e.g., "abdul" from "abdul@cseb.com")
    const username = Number(user.email.split('@')[0]);
    console.log(username)
   

    // 3. Fetch specific data for THIS user
    
    getStudentData(username); 
    getBalance()
    
  } else {
    // No user is logged in, kick them back to login page
    window.location.href = "./index.html";
  }

  
});
async function getBalance(){
    const expenseRef=collection(db,'expenses')
    let totalExpense=0;
    try{
        const querySnapshot = await getDocs(expenseRef);
        querySnapshot.forEach((doc)=>{
            const data=doc.data()
            totalExpense+= data.amount
        })
        console.log(totalExpense)
        let totalCollected=await find_balance()
        let balance= totalCollected-totalExpense
       document.getElementById("total-balance").textContent = balance
              
    }catch(err){
        console.log(err)
    }
}
async function getStudentData(inputRollNo) {
  // 1. Reference the 'users' collection
  const usersRef = collection(db, "users");
  console.log(usersRef)

  // 2. Create the query
  // This looks for a document where 'rollNumber' == the one the user typed
  const q = query(usersRef, where("rollNo", "==", inputRollNo));

  try {
    // 3. Execute the query
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 4. Loop through results (there should only be one for a unique roll no)
      querySnapshot.forEach((doc) => {
        const data = doc.data(); // This is the actual object
        
        console.log("Found User:", data.name);
        console.log("Total Contributed:", data.totalPaid);
        document.getElementById("user-total").textContent=data.totalPaid
        document.getElementById("user-name").textContent=data.name
        
      });
    } else {
      console.log("No student found with that Roll Number.");
    }
  } catch (error) {
    console.error("Error fetching student:", error);
  }
}

document.getElementById("classFund-card").addEventListener("click",()=>{
  console.log("card")
    navigateToClassFund()
    loadExpenses()
} )
document.getElementById("back-btn").addEventListener("click",navigateToHome)

async function loadExpenses(){
    const expenseRef=collection(db,'expenses')
    
    try{
        const querySnapshot = await getDocs(expenseRef);
        let expenses=``
        querySnapshot.forEach((doc)=>{
            const data=doc.data()
            expenses+= `<tr> <td> ${data.date} </td> <td> ${data.item} </td>  <td> ${data.amount} </td></tr>`
        })
        
        console.log(expenses)
        document.getElementById("class-fund-table").innerHTML=expenses
        
    }catch(err){
        console.log(err)
    }

}
async function find_balance(){
    const expenseRef=collection(db,'users')
    
    try{
        const querySnapshot = await getDocs(expenseRef);
        let total=0
        querySnapshot.forEach((doc)=>{
            const data=doc.data()
            total+=Number(data.totalPaid)
           
        })
        return total
       
        
    }catch(err){
        console.log(err)
    }

}



