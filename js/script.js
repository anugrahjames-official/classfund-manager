import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

const loginBtn = document.getElementById("login-btn");
const userEl = document.getElementById("user");
const passEl = document.getElementById("pass");

loginBtn.addEventListener("click", () => {
  const user = userEl.value.trim();
  const pass = passEl.value.trim();

  if (!user || !pass) {
    alert("Enter roll no and password");
    return;
  }

  const email = `${user}@cseb.com`;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Login success");
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      alert("Login failed");
      console.error(err.code, err.message);
    });
});

