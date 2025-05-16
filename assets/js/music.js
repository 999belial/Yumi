const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("toggle-music");
let isPlaying = false;

toggleBtn.addEventListener("click", () => {
  if (!isPlaying) {
    music
      .play()
      .then(() => {
        toggleBtn.textContent = "🔇 Вимкнути музику";
        isPlaying = true;
      })
      .catch((err) => {
        console.log("Автовідтворення заборонене:", err);
      });
  } else {
    music.pause();
    toggleBtn.textContent = "🎵 Увімкнути музику";
    isPlaying = false;
  }
});
