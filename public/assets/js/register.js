const registerModal = document.getElementById("registerModal");
const registerBtn = document.querySelector(".auto1");
const closeRegister = document.querySelector(".close-register");
const registerForm = document.getElementById("registerForm");
const errorBox = document.getElementById("register-error");

registerBtn.addEventListener("click", () => {
  registerModal.style.display = "flex";
});

closeRegister.addEventListener("click", () => {
  registerModal.style.display = "none";
  resetForm();
});

window.addEventListener("click", (e) => {
  if (e.target === registerModal) {
    registerModal.style.display = "none";
    resetForm();
  }
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-password-confirm").value;

  let error = "";

  if (username.length < 3) {
    error = "Логін повинен містити щонайменше 3 символи.";
  } else if (!validateEmail(email)) {
    error = "Введіть коректний email.";
  } else if (password.length < 6) {
    error = "Пароль повинен містити щонайменше 6 символів.";
  } else if (password !== confirm) {
    error = "Паролі не збігаються.";
  }

  if (error) {
    errorBox.style.display = "block";
    errorBox.textContent = error;
    return;
  }

  // Отправка данных на сервер
  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Ви успішно зареєстровані!");
        registerModal.style.display = "none";
        resetForm();
      } else {
        errorBox.style.display = "block";
        errorBox.textContent = data.error || "Помилка реєстрації.";
      }
    })
    .catch(() => {
      errorBox.style.display = "block";
      errorBox.textContent = "Сервер недоступний.";
    });
});

function resetForm() {
  registerForm.reset();
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
