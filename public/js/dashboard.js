import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";
import {navigateToClassFund,navigateToHome,openPayModal,closePayModal} from "./navigations.js"



let username=null
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 1. Get the username back from the email
    username = Number(user.email.split('@')[0]);
    console.log(username)
   

    // 3. Fetch specific data for THIS user
    
    getStudentData(username); 
    getBalance()
    
    
  } else {
   
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

document.getElementById("logout-btn").addEventListener("click",()=>{
  console.log("Logged out")
  window.location.href = "./index.html"
})

async function getStudentData(inputRollNo) {
  // 1. Reference the 'users' collection
  const usersRef = collection(db, "users");
  console.log(usersRef)

  const q = query(usersRef, where("rollNo", "==", inputRollNo));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
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
//payment functions 


//open modal

document.getElementById("pay-btn").addEventListener("click",openPayModal)
document.getElementById("cancel-link").addEventListener("click",closePayModal)


async function createPendingDocument(userName){
  try {
    const colRef = collection(db, "transactions");

    const docRef = await addDoc(colRef, {
      name: username,
      status: "pending",
      createdAt: serverTimestamp() 
    });

    console.log("Document written with ID: ", docRef.id);
    alert("Request submitted successfully!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

document.getElementById("proceedBtn").addEventListener("click",createPendingDocument)



function startMusic(filePath) {
  const bgm = new Audio(filePath);
  bgm.loop = true;
  bgm.volume = 0.15;

  const playAudio = () => {
    bgm.play()
      .then(() => {
        console.log("🔊 Retro BGM Active");
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
      })
      .catch(err => console.log("Waiting for user click..."));
  };

  window.addEventListener('click', playAudio);
  window.addEventListener('touchstart', playAudio); 
}

startMusic('./bg.mp3');
