import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../services/firebase.js";
import { navigateToClassFund, navigateToHome, openPayModal, closePayModal } from "../utils/navigations.js"
import { startMusic } from "../utils/startMusic.js"
import { find_balance } from "../services/balance.js";
import { loadExpenses } from "../services/expense.js";
import { createPendingDocument } from "../services/payment.js";
import { getStudentData } from "../services/users.js"

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

document.getElementById("proceedBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Proceeding to payment (handler started)")
  console.log("window.razorpay:", window.razorpay)
  const user =auth.currentUser;
  const idToken = await user.getIdToken()
  console.log("ID Token:", idToken)
  try {

    // Step A: Request our backend to create an order
    const amountRupees = 20;
    const response = await fetch('api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , "Authorization": `Bearer ${idToken}`},
      body: JSON.stringify({ rollNo: username, amount: amountRupees })
    });

    const orderData = await response.json();
    console.log("Order created:", orderData);
    // Step B: Set up the payment window options
    const options = {
      "key": "rzp_test_SpD52f1q7sax0C",
      "amount": orderData.amount,
      "currency": "INR",
      "name": "My Online Store",
      "order_id": orderData.orderId,
      "handler": function (response) {
        console.log("Payment successful:", response);
        alert("Payment successful! ID: " + response.razorpay_payment_id);
        const verifyResponse = fetch('api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        }).then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
              alert("Payment verified successfully!");
            } else {
              alert("Payment verification failed.");
            }
          });
      }
    };

    // Step C: Open the payment window
    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment failed to initialize:", error);
    alert("Could not start payment. Is the server running?");
  }
})

startMusic('./bg.mp3');
