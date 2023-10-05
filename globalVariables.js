//to pause game
let isPaused = false;

let gamePaused = false;

let gameRunning = false;

let score = 0;

let lastFired = 0;

let projectileSpeed = 3;

// Add a new variable for player invincibility
let invincible = false;

// Single onload function for both images
let imagesLoaded = 0;

let lastEnemySpawn = performance.now();

let powerUpTimeout;

let level = 1;
let enemiesSpawned = 0;
let enemiesDestroyed = 0;
let enemiesToDestroy = 3;
let startNewLevel = false;
let gameLoopRunning = false;
let enemiesDestroyedCurrentLevel = 0;

let enemiesSpawned2 = 0;
let levelComplete = false;

let explosions = [];

let targets2 = [];

let gameMode = ""; // Add this variable at the beginning of your script

// Load the sound file
const buttonSound = new Audio("button-sound.wav");
