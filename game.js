const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Game State ---
let player = {
  x: 220,
  y: 550,
  width: 40,
  height: 40,
  armor: 100,
  speed: 3,
};
let bullets = [];
let enemies = [];
let loots = [];
let score = 0;
let wave = 1;

let shootCooldown = 400;
let lastShot = 0;
let multiShot = false;

let bgY = 0;

// --- Controls ---
let joystickDelta = 0;
const knob = document.getElementById("knob");
let dragging = false;

knob.addEventListener("touchstart", () => (dragging = true));
window.addEventListener("touchend", () => {
  dragging = false;
  knob.style.left = "30px";
  joystickDelta = 0;
});
window.addEventListener("touchmove", (e) => {
  if (dragging) {
    const delta = e.touches[0].clientX - canvas.offsetLeft - 80;
    joystickDelta = Math.max(-20, Math.min(20, delta));
    knob.style.left = 30 + joystickDelta + "px";
  }
});

// Shoot button
document.getElementById("shootBtn").addEventListener("click", shootBullet);

// --- Asset Placeholders ---
const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

// --- Shoot ---
function shootBullet() {
  const now = Date.now();
  if (now - lastShot >= shootCooldown) {
    bullets.push({ x: player.x + 18, y: player.y });
    if (multiShot) {
      bullets.push({ x: player.x + 5, y: player.y });
      bullets.push({ x: player.x + 31, y: player.y });
    }
    lastShot = now;
  }
}

// --- Spawn Functions ---
function spawnWave() {
  if (wave % 3 === 0) {
    enemies.push({ x: 160, y: -100, width: 80, height: 80, hp: 15, boss: true });
  } else {
    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: i * 90 + 20,
        y: -60,
        width: 40,
        height: 40,
        hp: 1,
        boss: false,
      });
    }
  }
  wave++;
}

function spawnLoot(x, y) {
  const types = ["armor", "multi", "fast"];
  const type = types[Math.floor(Math.random() * types.length)];
  loots.push({ x, y, type });
}

// --- Game Loop ---
function gameLoop() {
  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player movement
  player.x += joystickDelta * 0.3;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Draw player
  drawRect(player.x, player.y, player.width, player.height, "cyan");

  // Bullets
  bullets.forEach((b, i) => {
    b.y -= 6;
    drawRect(b.x, b.y, 4, 10, "yellow");
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Enemies
  if (enemies.length === 0) spawnWave();
  enemies.forEach((e, i) => {
    e.y += e.boss ? 1.5 : 2;
    drawRect(e.x, e.y, e.width, e.height, e.boss ? "red" : "orange");

    bullets.forEach((b, j) => {
      if (
        b.x < e.x + e.width &&
        b.x + 4 > e.x &&
        b.y < e.y + e.height &&
        b.y + 10 > e.y
      ) {
        e.hp--;
        bullets.splice(j, 1);
        if (e.hp <= 0) {
          enemies.splice(i, 1);
          score += e.boss ? 100 : 10;
          if (Math.random() < 0.3) spawnLoot(e.x, e.y);
        }
      }
    });

    if (
      e.y > player.y &&
      e.x < player.x + player.width &&
      e.x + e.width > player.x
    ) {
      enemies.splice(i, 1);
      player.armor -= e.boss ? 40 : 20;
      if (player.armor <= 0) {
        alert("Game Over! Final Score: " + score);
        location.reload();
      }
    }
  });

  // Loots
  loots.forEach((l, i) => {
    l.y += 1;
    drawRect(l.x, l.y, 20, 20, l.type === "armor" ? "green" : l.type === "multi" ? "blue" : "magenta");

    if (
      l.y > player.y &&
      l.x < player.x + player.width &&
      l.x + 20 > player.x
    ) {
      if (l.type === "armor") player.armor = Math.min(100, player.armor + 20);
      if (l.type === "multi") {
        multiShot = true;
        setTimeout(() => (multiShot = false), 5000);
      }
      if (l.type === "fast") {
        shootCooldown = 100;
        setTimeout(() => (shootCooldown = 400), 5000);
      }
      loots.splice(i, 1);
    }
  });

  // Armor bar
  ctx.fillStyle = "white";
  ctx.fillRect(10, 10, 100, 10);
  ctx.fillStyle = "lime";
  ctx.fillRect(10, 10, player.armor, 10);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText("Score: " + score, 380, 20);

  requestAnimationFrame(gameLoop);
}

gameLoop();
