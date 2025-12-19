const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const speedDisplay = document.getElementById("speed");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

const startBtn = document.getElementById("startBtn");
const restartBtn2 = document.getElementById("restartBtn2");

const difficultySelect = document.getElementById("difficultySelect");

// -------------------- GAME STATE --------------------
let grid = 20;
let snake, dx, dy, food;
let score, hue;
let speed = 130;
let gameRunning = false;
let gameOver = false;

// -------------------- TOUCH STATE --------------------
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

// -------------------- DIFFICULTY --------------------
const difficultyMap = {
  170: "Slow",
  130: "Normal",
  100: "Fast",
  80: "Very Fast"
};

// -------------------- INIT --------------------
function init() {
  snake = [{ x: 200, y: 200 }];
  dx = grid;
  dy = 0;
  score = 0;
  hue = 0;
  gameOver = false;

  food = spawnFood();
  speed = Number(difficultySelect.value);
  speedDisplay.textContent = difficultyMap[speed];
  scoreDisplay.textContent = score;
}

// -------------------- UI EVENTS --------------------
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameRunning = true;
};

restartBtn2.onclick = restartGame;

difficultySelect.addEventListener("change", () => {
  speed = Number(difficultySelect.value);
  speedDisplay.textContent = difficultyMap[speed];
});

function restartGame() {
  init();
  gameOverScreen.classList.add("hidden");
  gameRunning = true;
}

// -------------------- KEYBOARD CONTROLS --------------------
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowUp" && dy === 0) (dy = -grid), (dx = 0);
  if (e.key === "ArrowDown" && dy === 0) (dy = grid), (dx = 0);
  if (e.key === "ArrowLeft" && dx === 0) (dx = -grid), (dy = 0);
  if (e.key === "ArrowRight" && dx === 0) (dx = grid), (dy = 0);
});

// -------------------- TOUCH CONTROLS --------------------
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: false }
);

canvas.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    if (!gameRunning) return;

    const touch = e.changedTouches[0];
    const dxTouch = touch.clientX - touchStartX;
    const dyTouch = touch.clientY - touchStartY;

    if (
      Math.abs(dxTouch) < SWIPE_THRESHOLD &&
      Math.abs(dyTouch) < SWIPE_THRESHOLD
    )
      return;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
      if (dxTouch > 0 && dx === 0) {
        dx = grid;
        dy = 0;
      } else if (dxTouch < 0 && dx === 0) {
        dx = -grid;
        dy = 0;
      }
    } else {
      if (dyTouch > 0 && dy === 0) {
        dy = grid;
        dx = 0;
      } else if (dyTouch < 0 && dy === 0) {
        dy = -grid;
        dx = 0;
      }
    }
  },
  { passive: false }
);

// -------------------- GAME LOGIC --------------------
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
    y: Math.floor(Math.random() * (canvas.height / grid)) * grid
  };
}

function update() {
  if (!gameRunning || gameOver) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function endGame() {
  gameOver = true;
  gameRunning = false;
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

// -------------------- RENDER --------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameRunning) return;

  ctx.fillStyle = "#ff4d4d";
  ctx.shadowColor = "#ff1a1a";
  ctx.shadowBlur = 18;
  ctx.fillRect(food.x, food.y, grid, grid);
  ctx.shadowBlur = 0;

  hue += 3;
  snake.forEach((s, i) => {
    ctx.fillStyle = `hsl(${(hue + i * 12) % 360}, 90%, 60%)`;
    ctx.fillRect(s.x, s.y, grid, grid);
  });
}

// -------------------- LOOP --------------------
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, speed);
}

// -------------------- START --------------------
init();
gameLoop();
