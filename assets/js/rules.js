const rulesBtn = document.getElementById("rulesBtn");
const rulesModal = document.getElementById("rulesModal");
const closeRules = document.getElementById("closeRules");

rulesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  rulesModal.style.display = "flex";
});

closeRules.addEventListener("click", () => {
  rulesModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === rulesModal) {
    rulesModal.style.display = "none";
  }
});
