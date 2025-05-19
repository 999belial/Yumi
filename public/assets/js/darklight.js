const darkBtn = document.getElementById("toggle-dark");
const body = document.body;

if (localStorage.getItem("dark-mode") === "true") {
  body.classList.add("dark-mode");
  darkBtn.textContent = "☀️ Світлий режим";
}

darkBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  darkBtn.textContent = isDark ? "☀️ Світлий режим" : "🌙 Темний режим";
  localStorage.setItem("dark-mode", isDark);
});
