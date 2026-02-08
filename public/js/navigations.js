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
    document.getElementById('pay-modal').classList.remove('hidden');
    document.getElementById('pay-amount').value = '';
    document.getElementById('pay-amount').focus();
}

function closePayModal() {
    document.getElementById('pay-modal').classList.add('hidden');
}

export {navigateToClassFund,navigateToHome,openPayModal,closePayModal}