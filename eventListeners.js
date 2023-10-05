
window.addEventListener("keydown", (e) => movePlayer(e, true));
window.addEventListener("keyup", (e) => movePlayer(e, false));

const video = document.getElementById("video-background");

video.addEventListener("canplay", function () {
  video.play();
  //   requestAnimationFrame(update);
});

// Assuming you have two buttons with the IDs "levelPlayButton" and "survivalButton"

document.addEventListener("DOMContentLoaded", () => {
  const levelPlayButton = document.getElementById("levelPlayButton");
  const survivalButton = document.getElementById("survivalMode");

  levelPlayButton.addEventListener("click", () => startGame("levelPlay"));
  const survivalModeButton = document.getElementById("survivalMode");
  survivalModeButton.addEventListener("click", () => startGame("survival"));
});


const volumeSlider = document.getElementById("volumeSlider");

// Set the initial volume for the background music
backgroundMusic.volume = volumeSlider.value / 100;

// Update the volume when the slider is move
volumeSlider.addEventListener("input", function (event) {
  console.log("Slider event:", event); // Log the slider event
  backgroundMusic.volume = event.target.value / 100;
  console.log("Volume:", backgroundMusic.volume);
});

const settingsPopup = document.getElementById("settingsPopup");
const unpauseButton = document.getElementById("unpauseButton");
restartButton.addEventListener("click", restartGame);

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (
    x >= canvas.width - settingsIcon.desiredWidth - 10 &&
    x <= canvas.width - 10 &&
    y >= canvas.height - settingsIcon.desiredHeight - 10 &&
    y <= canvas.height - 10
  ) {
    pauseGame(true);
    toggleSettingsPopup();
  }
});

// Unpause the game
// For the unpause button event listener
unpauseButton.addEventListener("click", function () {
  toggleSettingsPopup(false); // Hide the settings popup
  pauseGame(false);
});

// For the restart button event listener
restartButtonMenu.addEventListener("click", function () {
  toggleSettingsPopup(false); // Hide the settings popup
  restartGame();
});

// For the home button event listener
homeButton.addEventListener("click", function () {
  toggleSettingsPopup(false); // Hide the settings popup

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  // Stop the game loop
  gameLoopRunning = false;
  if (animationFrameRequest) {
    cancelAnimationFrame(animationFrameRequest);
  }

  restartGame(false);
  showMainMenu();
});

// For the 'M' key event listener
document.addEventListener("keydown", function (event) {
  if (event.key.toLowerCase() === "m") {
    const shouldShow = settingsPopup.style.display === "none";
    toggleSettingsPopup(shouldShow);
    pauseGame(!isPaused);
  }
});

function toggleSettingsPopup(show) {
  settingsPopup.style.display = show ? "block" : "none";
  pauseGame(show);
}

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const settingsIconX = canvas.width - settingsIcon.desiredWidth - 10;
  const settingsIconY = canvas.height - settingsIcon.desiredHeight - 10;

  if (
    x >= settingsIconX &&
    x <= settingsIconX + settingsIcon.desiredWidth &&
    y >= settingsIconY &&
    y <= settingsIconY + settingsIcon.desiredHeight
  ) {
    const shouldShow = settingsPopup.style.display === "none";
    toggleSettingsPopup(shouldShow);
    pauseGame(shouldShow);
  }
});
