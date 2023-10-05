function startGameWithMode(mode) {
    gameMode = mode;
  
    // Hide the main menu
    const mainMenu = document.getElementById("mainMenu");
    if (mainMenu) {
      mainMenu.style.display = "none";
    }
  
    startGame();
  }
  
  function showMainMenu() {
    // Close the settings popup if it's open
    toggleSettingsPopup();
  
    // Pause the background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  
    // Hide the game screen (assuming it has an id 'gameScreen')
    const gameScreen = document.getElementById("game");
    gameScreen.style.display = "none";
  
    // Show the main menu screen (assuming it has an id 'mainMenuScreen')
    const mainMenuScreen = document.getElementById("mainMenu");
    mainMenuScreen.style.display = "block";
  
    // Hide the settings popup (assuming it has an id 'settingsPopup')
    const settingsPopup = document.getElementById("settingsPopup");
    settingsPopup.style.display = "none";
  
    // Reset the game state and stop the game loop
    gameLoopRunning = false;
  }
  
  function showSettingsMenu() {
    const settingsMenu = document.getElementById("settingsPopup");
    const canvas = document.getElementById("game");
  
    settingsMenu.style.left =
      canvas.clientWidth / 2 - settingsMenu.clientWidth / 2 + "px";
    settingsMenu.style.top =
      canvas.clientHeight / 2 - settingsMenu.clientHeight / 2 + "px";
    settingsMenu.style.display = "block";
  }
  
  function startGame(gameMode) {
    currentGameMode = gameMode;
  
    level = 1;
    targets.length = 0;
    enemiesSpawned = 0;
    enemiesDestroyed = 0;
  
    // Hide the main menu screen (assuming it has an id 'mainMenuScreen')
    const mainMenuScreen = document.getElementById("mainMenu");
    mainMenuScreen.style.display = "none";
  
    // Show the game screen (assuming it has an id 'gameScreen')
    const gameScreen = document.getElementById("game");
    gameScreen.style.display = "block";
  
    // Hide the settings popup if it's open
    toggleSettingsPopup();
  
    if (gameMode === "levelPlay") {
      enemiesToDestroy = level * 3;
    } else if (gameMode === "survival") {
      enemiesToDestroy = Infinity; // Set enemiesToDestroy to infinity for the survival mode
    }
  
    gameLoopRunning = true;
    isPaused = false;
    update();
    backgroundMusic.play();
  }
  
  const settingsIcon = new Image();
  settingsIcon.src = "settings-icons.png"; // Replace with the path to your settings icon image
  
  // Draw the settings icon when the game starts
  settingsIcon.isLoaded = false; // Add this line to track the image load status
  
  settingsIcon.addEventListener("load", function () {
    settingsIcon.isLoaded = true;
  });
  
  // Add these lines to set the desired width and height
  settingsIcon.desiredWidth = 50;
  settingsIcon.desiredHeight = 50;
  
  function drawSettingsIcon() {
    if (gameLoopRunning && settingsIcon.isLoaded) {
      ctx.drawImage(
        settingsIcon,
        canvas.width - settingsIcon.desiredWidth - 10,
        canvas.height - settingsIcon.desiredHeight - 10,
        settingsIcon.desiredWidth,
        settingsIcon.desiredHeight
      );
    }
  }
  
  function showLevelPopup() {
    levelPopup.style.display = "block";
    setTimeout(() => {
      levelPopup.style.display = "none";
      startGame();
    }, 2500); // Display the pop-up for 2.5 seconds
  }
  
  function pauseGame(pause) {
    isPaused = pause;
  
    // Pause or play the background music
    if (isPaused) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }
  }
  
  function movePlayer(e, isKeyDown) {
    keyState[e.code] = isKeyDown;
  }
  
  function updatePlayer() {
    if (keyState.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keyState.ArrowRight && player.x < canvas.width - player.width)
      player.x += player.speed;
    if (keyState.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keyState.ArrowDown && player.y < canvas.height - player.height)
      player.y += player.speed;
    if (keyState.Space && performance.now() - lastFired >= 200) {
      player.projectiles.push(
        new Projectile(player.x + player.width / 2 - 5, player.y)
      );
      lastFired = performance.now();
  
      // Play the laser sound effect
      laserSound.currentTime = 0;
      laserSound.play();
    }
  }
  
  function checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
  
  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      // Start the game after both images have been loaded
  
      // showLevelScreen();
  
      // Start the background music
      backgroundMusic.play();
    }
  }
  
  function checkLevelComplete() {
    return targets.length === 0;
  }
  
  // Create a new function to start the next level
  function startNextLevel() {
    level += 1;
    enemiesSpawned = 0; // Reset enemiesSpawned for the new level
    enemiesDestroyed = 0;
  
    enemiesToDestroy = level * 2;
    startNewLevel = true;
  
    // Reset the lastEnemySpawn variable
    lastEnemySpawn = performance.now() - 1500;
  
    // Call the update function to keep the game loop running
    if (!gameLoopRunning) {
      gameLoopRunning = true;
      update();
    }
  }
  
  function showLevelComplete() {
    const levelPopup = document.getElementById("level-popup");
    levelComplete = true;
  
    const levelUpSound = new Audio("levelupsound.mp3");
  
    levelUpSound.addEventListener("canplaythrough", function () {
      levelUpSound.play().catch((error) => {
        console.error("Error playing level up sound:", error);
      });
    });
  
    levelPopup.textContent = `Level ${level} Complete!`;
    levelPopup.style.display = "block";
    setTimeout(() => {
      levelPopup.style.display = "none";
      enemiesDestroyedCurrentLevel = 0;
      startNextLevel();
    }, 2000); // Display the pop-up for 2 seconds
  }
  
  function checkEnemiesDestroyed() {
    if (enemiesDestroyedCurrentLevel >= enemiesToDestroy) {
      enemiesDestroyedCurrentLevel = 0;
      enemiesSpawned = 0;
      enemiesSpawned2 = 0;
      enemiesToDestroy = Math.floor(enemiesToDestroy * 1.5);
      showLevelComplete();
    }
  }
  
  function createExplosion(x, y, enemyWidth, enemyHeight) {
    for (let i = 0; i < 20; i++) {
      explosions.push(
        new ExplosionParticle(x, y, ctx, explosionImage, enemyWidth, enemyHeight)
      );
    }
  }
  
  function addPowerUp() {
    if (!isPaused && gameRunning) {
      const x = Math.random() * (canvas.width - 30);
      const y = Math.random() * (canvas.height - 30);
      const powerUp = new PowerUp(x, y);
      powerUps.push(powerUp);
    }
  }
  
  function addExtraLifePowerUp() {
    if (!isPaused && gameRunning) {
      const x = Math.random() * (canvas.width - 30);
      const y = Math.random() * (canvas.height - 30);
      const extraLifePowerUp = new ExtraLifePowerUp(x, y);
      extraLifePowerUps.push(extraLifePowerUp);
    }
  }
  
  setInterval(addPowerUp, 2000);
  setInterval(addExtraLifePowerUp, 3000); // 30000ms = 30 seconds
  
  function addTarget() {
    const x = Math.random() * (canvas.width - 50);
    const speedX = Math.random() * 2 - 1; // Random speed between -1 and 1
    const speedY = Math.random() * 1 + 0.5; // Random speed between 0.5 and 1.5
  
    const target = {
      x: x,
      y: 10,
      width: 80,
      height: 80,
      speedX: speedX,
      speedY: speedY,
    };
  
    setTimeout(() => {
      const enemyProjectile = new EnemyProjectile(
        target.x + target.width / 2 - 5 / 2,
        target.y + target.height
      );
      target.projectile = enemyProjectile;
    }, 1000); // 1000ms delay
  
    targets.push(target);
  }
  
  function addTarget2() {
    const x = Math.random() * (canvas.width - 50);
    const speedX = Math.random() * 2 - 1; // Random speed between -1 and 1
    const speedY = Math.random() * 1 + 0.5; // Random speed between 0.5 and 1.5
    const baseSpeed = 2; // Replace this with the base speed value for your target2 enemies
    const speedMultiplier = 1 + 0.5 * (level - 2); // Calculate the speed multiplier based on the current level
    const speed = baseSpeed * speedMultiplier; // Calculate the new speed for target2 enemies
  
    const target2 = {
      x: x,
      y: 10,
      width: 80,
      height: 80,
      speedX: speedX,
      speedY: speedY,
      speed: speed,
    };
  
    setTimeout(() => {
      const enemyProjectile = new EnemyProjectile2(
        target2.x + target2.width / 2 - 5 / 2,
        target2.y + target2.height
      );
      target2.projectile = enemyProjectile;
    }, 800); // 1000ms delay
  
    targets2.push(target2);
  }
  
  function drawScore() {
    // Set the font, size, and style
    ctx.font = "20px Orbitron, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }
  
  function addExplosion(x, y) {
    const numParticles = 10;
    for (let i = 0; i < numParticles; i++) {
      explosions.push(new ExplosionParticle(x, y));
    }
  }
  
  // Add a variable for the flashing interval
  let flashingTimeout;
  
  function flashPlayerShip(times) {
    if (times > 0) {
      player.visible = !player.visible;
      clearTimeout(flashingTimeout); // Clear the previous flashing timeout
      flashingTimeout = setTimeout(() => flashPlayerShip(times - 1), 100);
    } else {
      player.visible = true;
    }
  }
  
  // Add a function for the invincibility cooldown
  function setInvincibilityCooldown() {
    invincible = true;
    flashPlayerShip(3 * 2); // Flash the player 3 times (visible -> not visible -> visible -> not visible -> visible -> not visible -> visible)
    setTimeout(() => {
      invincible = false;
      player.visible = true; // Ensure the player is visible after invincibility ends
    }, 2000); // Set invincibility time to 2000ms (2 seconds)
  }
  
  function draw() {
    explosions.forEach((explosion, index) => {
      explosion.update();
      if (explosion.isMaxSize() && explosion.opacity <= 0) {
        explosions.splice(index, 1);
      } else {
        if (explosion.opacity > 0) {
          explosion.drawExplosionImage();
        }
        explosion.draw();
      }
    });
  }
  
  function spawnEnemy() {
    if (
      performance.now() - lastEnemySpawn >= 1500 &&
      (enemiesSpawned < enemiesToDestroy || gameMode === "survival")
    ) {
      addTarget();
      enemiesSpawned += 1;
      lastEnemySpawn = performance.now();
    }
  
    // Add the spawning logic for the second enemy type
    if (
      level > 1 &&
      performance.now() - lastEnemySpawn >= 1000 &&
      (enemiesSpawned2 < Math.floor(enemiesToDestroy * 0.5) ||
        gameMode === "survival")
    ) {
      addTarget2();
      enemiesSpawned2 += 1;
      lastEnemySpawn = performance.now();
    }
  }
  
  let animationFrameRequest;
  
  function update() {
    if (gameLoopRunning) {
      if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        if (startNewLevel) {
          startNewLevel = false;
          enemiesSpawned = 0;
          targets.length = 0;
        }
  
        if (!isPaused) {
          spawnEnemy();
          updatePlayer();
  
          powerUps.forEach((powerUp) => {
            powerUp.update();
            powerUp.draw();
          });
  
          extraLifePowerUps.forEach((extraLifePowerUp) => {
            extraLifePowerUp.update();
            extraLifePowerUp.draw();
          });
  
          // Enemy Damage and Collision
          player.projectiles.forEach((p, i) => {
            p.update();
            p.draw();
  
            if (p.y < 0) player.projectiles.splice(i, 1);
  
            // Loop for checking collisions between projectiles and targets
            targets.forEach((t, j) => {
              if (checkCollision(p, t)) {
                player.projectiles.splice(i, 1);
                targets.splice(j, 1);
                score += 10;
                enemiesDestroyed++;
                enemiesDestroyedCurrentLevel++;
  
                checkEnemiesDestroyed();
  
                createExplosion(
                  t.x + t.width / 2,
                  t.y + t.height / 2,
                  t.width,
                  t.height
                );
  
                // Play the explosion sound effect
                explosionSound.currentTime = 0;
                explosionSound.play();
              }
            });
  
            // Loop for checking collisions between projectiles and targets2
            targets2.forEach((t, j) => {
              if (checkCollision(p, t)) {
                player.projectiles.splice(i, 1);
                targets2.splice(j, 1);
                score += 20;
                enemiesDestroyed++;
                enemiesDestroyedCurrentLevel++;
  
                checkEnemiesDestroyed();
                createExplosion(
                  t.x + t.width / 2,
                  t.y + t.height / 2,
                  t.width,
                  t.height
                );
  
                // Play the explosion sound effect
                explosionSound.currentTime = 0;
                explosionSound.play();
              }
            });
          });
  
          // Loop for checking collisions between the player and targets
          targets.forEach((t, j) => {
            if (checkCollision(player, t)) {
              targets.splice(j, 1);
              player.health -= 10;
              score += 10;
              enemiesDestroyed++;
              enemiesDestroyedCurrentLevel++;
              setInvincibilityCooldown(); // Trigger invincibility
              flashPlayerShip(3 * 2);
  
              checkEnemiesDestroyed();
              // Play the damage sound effect
              damageSound.currentTime = 0;
              damageSound.play();
            }
  
            if (
              t.projectile &&
              !invincible &&
              checkCollision(player, t.projectile)
            ) {
              player.health -= 10;
              setInvincibilityCooldown(); // Trigger invincibility
              flashPlayerShip(3 * 2);
  
              // Play the damage sound effect
              damageSound.currentTime = 0;
              damageSound.play();
            }
          });
  
          // Loop for checking collisions between the player and targets2
          targets2.forEach((t, j) => {
            if (checkCollision(player, t)) {
              targets2.splice(j, 1);
              player.health -= 20;
              score += 20;
              enemiesDestroyed++;
              enemiesDestroyedCurrentLevel++;
              setInvincibilityCooldown(); // Trigger invincibility
              flashPlayerShip(3 * 2);
  
              checkEnemiesDestroyed();
  
              // Play the damage sound effect
              damageSound.currentTime = 0;
              damageSound.play();
            }
  
            if (
              t.projectile &&
              !invincible &&
              checkCollision(player, t.projectile)
            ) {
              player.health -= 20;
              setInvincibilityCooldown(); // Trigger invincibility
              flashPlayerShip(3 * 2);
  
              // Play the damage sound effect
              damageSound.currentTime = 0;
              damageSound.play();
            }
          });
  
          // The rest of your code remains the same
  
          targets.forEach((t) => {
            t.x += t.speedX;
            t.y += t.speedY;
  
            if (t.projectile) {
              t.projectile.update();
              t.projectile.draw();
            }
  
            targets2.forEach((t) => {
              t.x += t.speedX;
              t.y += t.speedY;
  
              if (t.projectile) {
                t.projectile.update();
                t.projectile.draw();
              }
  
              // Check for collisions with canvas borders and reverse direction
              if (t.x < 0 || t.x > canvas.width - t.width) {
                t.speedX = -t.speedX;
              }
              if (t.y < 0 || t.y > canvas.height - t.height) {
                t.speedY = -t.speedY;
              }
  
              // Draw the second enemy type
              ctx.drawImage(target2Image, t.x, t.y, t.width, t.height);
            });
  
            // Check for collisions with canvas borders and reverse direction
            if (t.x < 0 || t.x > canvas.width - t.width) {
              t.speedX = -t.speedX;
            }
            if (t.y < 0 || t.y > canvas.height - t.height) {
              t.speedY = -t.speedY;
            }
  
            ctx.drawImage(targetImage, t.x, t.y, t.width, t.height);
          });
  
          extraLifePowerUps.forEach((extraLifePowerUp, i) => {
            extraLifePowerUp.update();
            extraLifePowerUp.draw();
  
            // Check for collisions between the player and extra life power-ups
            if (checkCollision(player, extraLifePowerUp)) {
              extraLifePowerUps.splice(i, 1);
              player.health += 20;
            }
          });
  
          ctx.save();
          if (!player.visible) {
            ctx.globalAlpha = 0;
          }
          ctx.drawImage(
            spaceshipImage,
            player.x,
            player.y,
            player.width,
            player.height
          );
          ctx.restore();
  
          function drawRoundedRect(ctx, x, y, width, height, borderRadius) {
            ctx.beginPath();
            ctx.moveTo(x + borderRadius, y);
            ctx.lineTo(x + width - borderRadius, y);
            ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
            ctx.lineTo(x + width, y + height - borderRadius);
            ctx.arcTo(
              x + width,
              y + height,
              x + width - borderRadius,
              y + height,
              borderRadius
            );
            ctx.lineTo(x + borderRadius, y + height);
            ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
            ctx.lineTo(x, y + borderRadius);
            ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
  
          function drawHealthBar() {
            const width = 200;
            const height = 20;
            const canvasWidth = ctx.canvas.width;
            const padding = 10;
            const x = canvasWidth - width - padding;
            const y = 10;
            const borderRadius = 5;
  
            // Draw the background
            ctx.fillStyle = "white";
            drawRoundedRect(ctx, x, y, width, height, borderRadius);
  
            // Draw the health bar fill with a gradient
            const healthWidth = (width * player.health) / 100;
            const healthGradient = ctx.createLinearGradient(
              x,
              y,
              x + healthWidth,
              y
            );
            healthGradient.addColorStop(0, "#00ff00");
            healthGradient.addColorStop(1, "#007700");
            ctx.fillStyle = healthGradient;
            drawRoundedRect(ctx, x, y, healthWidth, height, borderRadius);
  
            // Draw the border
            //   ctx.strokeStyle = "black";
            //   drawRoundedRect(ctx, x, y, width, height, borderRadius);
  
            // Draw the health text
            ctx.font = "14px 'Orbitron";
            ctx.fillStyle = "#023020";
            const healthText = `${player.health} / 100`;
            const textWidth = ctx.measureText(healthText).width;
            const textX = x + width - textWidth - 5; // 5 is the padding from the right edge of the health bar
            const textY = y + height / 2 + 5;
            ctx.fillText(healthText, textX, textY);
          }
  
          function drawHighScore() {
            const highScore = localStorage.getItem("highScore") || 0;
            ctx.font = "18px Orbitron, sans-serif";
            ctx.fillStyle = "white";
            ctx.fillText(`High Score: ${highScore}`, 10, 60);
          }
  
          drawScore();
          drawHealthBar();
          drawHighScore();
          drawSettingsIcon();
  
          if (player.health <= 0) {
            const highScore = localStorage.getItem("highScore") || 0;
            if (score > highScore) {
              localStorage.setItem("highScore", score);
            }
  
            gameOverScreen.style.display = "block";
  
            // Stop the background music
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
  
            // Play the "Game Over" sound
            gameOverSound.play();
            gameLoopRunning = false;
  
            return; // Stop updating the game
          }
  
          powerUps.forEach((powerUp, i) => {
            powerUp.draw();
            powerUp.update();
  
            // Check for collisions between the player and power-ups
            if (checkCollision(player, powerUp)) {
              powerUps.splice(i, 1);
              // Increase the laser speed by 20%
              projectileSpeed *= 1.2;
              // Add a timeout to revert the power-up effect after 5 seconds
              clearTimeout(powerUpTimeout);
              powerUpTimeout = setTimeout(() => {
                projectileSpeed /= 1.2;
              }, 5000);
            }
          });
        }
      }
  
      draw();
    }
    // Cancel any previous animation frame request
    if (animationFrameRequest) {
      cancelAnimationFrame(animationFrameRequest);
    }
  
    // Request the next animation frame and store the request ID
    animationFrameRequest = requestAnimationFrame(update);
  }
  
  let currentGameMode = null;
  
  function restartGame(playBackgroundMusic = true) {
    player.health = 100;
    player.x = canvas.width / 2 - player.width / 2; // Reset player's horizontal position
    player.y = canvas.height - player.height - 10; // Reset player's vertical position
    score = 0;
    enemiesDestroyed = 0; // Reset the number of enemies destroyed
    enemiesDestroyedCurrentLevel = 0; // Reset the number of enemies destroyed in the current level
    invincible = false; // Reset the invincibility state
    targets.length = 0;
    targets2.length = 0; // Reset the targets2 array, if you have one
    gameOverScreen.style.display = "none";
  
    // Set gameLoopRunning to true
    gameLoopRunning = true;
    isPaused = false;
  
    // Start a new game loop
    startGame(currentGameMode);
  
    if (playBackgroundMusic) {
      // Start the background music
      backgroundMusic.play();
    }
  
    animationFrameRequest = requestAnimationFrame(update);
  }
  