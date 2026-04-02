import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {startMusic} from "../utils/startMusic.js"
import { auth } from "../services/firebase.js";

const loginBtn = document.getElementById("login-btn");
const userEl = document.getElementById("user");
const passEl = document.getElementById("pass");
const user = null
const pass = null
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
      if(user==="admin"){
        setTimeout(()=>{ window.location.href='./admin/adminDashboard.html'})
      }else{

                setTimeout(() => { window.location.href = "./dashboard.html"; }, 1000);

      }
    })
    .catch((err) => {
      alert("Login failed");
      console.error(err.code, err.message);
    });
});


startMusic("./assets/audio/bg.mp3");

