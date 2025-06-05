const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game entities
let player = { x: 220, y: 550, width: 40, height: 40, armor: 100 };
let bullets = [];
let enemies = [];
let loots = [];
let wave = 1;

// Images
const playerImg = new Image();
playerImg.src = 'assets/player.png';

const enemyImg = new Image();
enemyImg.src = 'assets/enemy.png';

const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';

const lootImg = new Image();
lootImg.src = 'assets/loot.png';

// Movement
let joystickDelta = 0;
let shoot = false;

// Joystick control
const knob = document.getElementById('knob');
let dragging = false;

knob.addEventListener('touchstart', () => dragging = true);
window.addEventListener('touchend', () => { dragging = false; knob.style.left = '30px'; joystickDelta = 0; });
window.addEventListener('touchmove', e => {
  if (dragging) {
    const delta = e.touches[0].clientX - canvas.offsetLeft - 80;
    joystickDelta = Math.max(-20, Math.min(20, delta));
    knob.style.left = 30 + joystickDelta + 'px';
  }
});

// Shoot button
document.getElementById('shootBtn').addEventListener('click', () => {
  bullets.push({ x: player.x + 18, y: player.y });
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  player.x += joystickDelta * 0.3;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Bullets
  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.drawImage(bulletImg, b.x, b.y, 10, 20);
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Enemies
  if (enemies.length === 0) spawnWave();
  enemies.forEach((e, i) => {
    e.y += 2;
    ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);

    // Bullet collision
    bullets.forEach((b, j) => {
      if (b.x < e.x + e.width && b.x + 10 > e.x && b.y < e.y + e.height && b.y + 20 > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        if (Math.random() < 0.3) spawnLoot(e.x, e.y);
      }
    });

    // Hit player
    if (e.y > player.y && e.x < player.x + player.width && e.x + e.width > player.x) {
      enemies.splice(i, 1);
      player.armor -= 20;
      if (player.armor <= 0) {
        alert('Game Over');
        location.reload();
      }
    }
  });

  // Loots
  loots.forEach((l, i) => {
    l.y += 1.5;
    ctx.drawImage(lootImg, l.x, l.y, 20, 20);

    if (l.y > player.y && l.x < player.x + player.width && l.x + 20 > player.x) {
      player.armor = Math.min(100, player.armor + 10);
      loots.splice(i, 1);
    }
  });

  // Armor bar
  ctx.fillStyle = 'white';
  ctx.fillRect(10, 10, 100, 10);
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, player.armor, 10);

  requestAnimationFrame(gameLoop);
}

function spawnWave() {
  for (let i = 0; i < 5; i++) {
    enemies.push({ x: i * 90 + 20, y: -60, width: 40, height: 40 });
  }
  wave++;
}

function spawnLoot(x, y) {
  loots.push({ x, y });
}

gameLoop();
