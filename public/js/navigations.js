function navigateToHome() {
    console.log("clicked");
    document.getElementById("class-fund-page").classList.toggle("hidden");
    document.getElementById("home-page").classList.toggle("hidden");
}

function navigateToClassFund() {
    document.getElementById("home-page").classList.toggle("hidden");
    document.getElementById("class-fund-page").classList.toggle("hidden");
}

function openPayModal() {
    document.getElementById("modalOverlay").classList.add("visible-modal")
    
}

function closePayModal() {
    document.getElementById("modalOverlay").classList.remove("visible-modal")
}

export {navigateToClassFund,navigateToHome,openPayModal,closePayModal}