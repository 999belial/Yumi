const authModal = document.getElementById("authModal");
      const authBtn = document.querySelector(".auto");
      const closeAuth = document.querySelector(".close-auth");

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
      document.getElementById("authForm").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Форма відправлена!");
        authModal.style.display = "none";
      });