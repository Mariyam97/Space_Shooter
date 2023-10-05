const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restart");
const restartButtonMenu = document.getElementById("restartButton");

const laserBeamImage = new Image();
laserBeamImage.src = "laser-beam.png";

const laserSound = document.getElementById("laser-sound");
const explosionSound = document.getElementById("explosion-sound");
const backgroundMusic = document.getElementById("background-music");
const gameOverSound = document.getElementById("game-over-sound");
const pausedMessage = document.getElementById("paused-message");
const powerUpImage = document.getElementById("power-up-image");

const levelPopup = document.getElementById("level-popup");
const startButton = document.getElementById("start-button");

// const videoBackground = document.getElementById("video-background");

const powerUps = [];
const extraLifePowerUps = [];
const targets = [];
const extraLifeImg = new Image();
const spaceshipImage = new Image();
const targetImage = new Image();

const target2Image = new Image();
target2Image.src = "enemy-2.png";

// Get the damage sound element
const damageSound = document.getElementById("damageSound");

const mainMenu = document.getElementById("mainMenu");
const levelPlayButton = document.getElementById("levelPlay");
const survivalModeButton = document.getElementById("survivalMode");

const homeButton = document.getElementById("homeButton");

const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 80,
  height: 80,
  speed: 3,
  health: 100,
  projectiles: [],
  visible: true,
};

const keyState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Space: false,
};

const explosionImage = new Image();
explosionImage.src = "explosion-1.png";
const explosionImageTime = 1;
