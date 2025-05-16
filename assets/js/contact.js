const contactLink = document.getElementById("contactLink");
const contactModal = document.getElementById("contactModal");
const closeBtn = document.getElementById("closeContact");

contactLink.addEventListener("click", (e) => {
  e.preventDefault();
  contactModal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  contactModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = "none";
  }
});
