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

document.getElementById("proceedBtn").addEventListener("click",async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Proceeding to payment (handler started)")
  console.log("window.razorpay:", window.razorpay)
  try {
    // Step A: Request our backend to create an order
    const response = await fetch('http://127.0.0.1:5001/class-fund-1465c/us-central1/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: username, amount: 500 }) // Amount in paise (₹500)
    });

    const orderData = await response.json();
    console.log("Order created:", orderData);
    // Step B: Set up the payment window options
    const options = {
      "key": "rzp_test_SpD52f1q7sax0C", // Replace with your test key later
      "amount": orderData.amount,
      "currency": "INR",
      "name": "My Online Store",
      "order_id": orderData.orderId, // Links this checkout to our backend order
      "handler": function (response) {
        console.log("Payment successful:", response);
        alert("Payment successful! ID: " + response.razorpay_payment_id);
        const verifyResponse = fetch('http://127.0.0.1:5001/class-fund-1465c/us-central1/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response) // Send the entire response for verification
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
