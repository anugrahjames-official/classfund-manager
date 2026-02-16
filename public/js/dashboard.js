import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";
import { navigateToClassFund, navigateToHome, openPayModal, closePayModal } from "./navigations.js"
import { startMusic } from "./startMusic.js"
import { find_balance } from "./util.js";
import { loadExpenses } from "./expense.js";
import { createPendingDocument } from "./payment.js";
import { getStudentData } from "./users.js"

let username = null
onAuthStateChanged(auth, (user) => {
  if (user) {
    username = Number(user.email.split('@')[0]);
    console.log(username)

    start()


  } else {

    window.location.href = "./index.html";
  }


});

async function start() {
  const data = await getStudentData(username);

  document.getElementById("total-balance").textContent = await find_balance()
  document.getElementById("user-total").textContent = data.totalPaid
  document.getElementById("user-name").textContent = data.name
}




//logout function 
document.getElementById("logout-btn").addEventListener("click", () => {
  console.log("Logged out")
  window.location.href = "./index.html"
})


document.getElementById("classFund-card").addEventListener("click", () => {
  console.log("card")
  navigateToClassFund()
  loadExpenses()

})

document.getElementById("back-btn").addEventListener("click", navigateToHome)

document.getElementById("pay-btn").addEventListener("click", openPayModal)

document.getElementById("cancel-link").addEventListener("click", closePayModal)

document.getElementById("proceedBtn").addEventListener("click",()=>{
   createPendingDocument(username)
})

startMusic('./bg.mp3');
