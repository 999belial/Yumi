const authModal = document.getElementById("authModal");
const authBtn = document.querySelector(".auto");
const closeAuth = document.querySelector(".close-auth");
const authForm = document.getElementById("authForm");

authBtn.addEventListener("click", () => {
  authModal.style.display = "flex";
});

closeAuth.addEventListener("click", () => {
  authModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === authModal) {
    authModal.style.display = "none";
  }
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("👋 Вітаємо, ви ввійшли!");
        authModal.style.display = "none";
        window.location.href = '/profile.html';
        authForm.reset();
      } else {
        alert(data.error || "❌ Невірний логін або пароль.");
      }
    })
    .catch(() => {
      alert("❌ Сервер недоступний.");
    });
});
