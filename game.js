spaceshipImage.src = "ship.png";
targetImage.src = "target.png";

extraLifeImg.src = "extra-life.png";

spaceshipImage.onload = imageLoaded;
targetImage.onload = imageLoaded;

extraLifePowerUps.forEach((extraLifePowerUp, i) => {
  extraLifePowerUp.update();
  extraLifePowerUp.draw();

  // Check for collisions between the player and extra life power-ups
  if (checkCollision(player, extraLifePowerUp)) {
    extraLifePowerUps.splice(i, 1);
    lives += 20;
  }
});

// Function to play the sound effect
function playSound() {
  buttonSound.currentTime = 0; // Reset the sound to the start
  buttonSound.play(); // Play the sound
}

// Add event listeners for mouseover event on the buttons
document
  .getElementById("levelPlayButton")
  .addEventListener("mouseover", playSound);
document
  .getElementById("survivalMode")
  .addEventListener("mouseover", playSound);
