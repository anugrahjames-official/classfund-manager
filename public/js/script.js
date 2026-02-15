import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

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
      alert("Login success");
      setTimeout(() => { window.location.href = "./dashboard.html"; }, 1000);
    })
    .catch((err) => {
      alert("Login failed");
      console.error(err.code, err.message);
    });
});
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

hhhstartMusic('./bg.mp3');

