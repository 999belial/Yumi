document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/session")
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        document.getElementById("guest-actions").style.display = "none";
        const userActions = document.getElementById("user-actions");
        userActions.style.display = "flex";

        document.getElementById("user-avatar").src = "assets/img/" + (data.user.avatar || "default.png");
      } else {
        document.getElementById("guest-actions").style.display = "flex";
        document.getElementById("user-actions").style.display = "none";
      }
    });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/api/logout", { method: "POST" }).then(() => location.reload());
    });
  }
});
