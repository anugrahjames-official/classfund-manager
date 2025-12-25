const loginBtn=document.getElementById("login-btn")
const userEl=document.getElementById("user")
const passEl=document.getElementById("pass")

loginBtn.addEventListener("click",()=>{
    let user=userEl.value
    let pass=passEl.value
    console.log(user,pass)
    userEl.value=""
    passEl.value=""    
})