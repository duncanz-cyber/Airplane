let plane = document.getElementById('plane');
let game = document.getElementById('game');
let obstacle = document.getElementById('obstacle');
let score = 0;

function selectPlane(color) {
  plane.src = `assets/plane-${color}.png`;
  document.getElementById('menu').style.display = 'none';
  game.style.display = 'block';
  startGame();
}

function startGame() {
  let posX = 175;
  let obsY = 0;
  let obsX = Math.floor(Math.random() * 

  function fall() {
    obsY += 5;
    obstacle.style.top = obsY + 'px';
    obstacle.style.left = obsX + 'px';

    if (obsY > 570) {
      obsY = 0;
      obsX = Math.floor(Math.random() * 370);
      score++;
      document.getElementById('score').textContent = 'Score: ' + score;
    }

    // Collision detection
    const planeRect = plane.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    if (
      planeRect.left < obsRect.right &&
      planeRect.right > obsRect.left &&
      planeRect.top < obsRect.bottom &&
      planeRect.bottom > obsRect.top
    ) {
      alert('Game Over! Final Score: ' + score);
      location.reload();
    }

    requestAnimationFrame(fall);
  }

  fall();
}
let enemy = document.getElementById('enemy');
let bullet = document.getElementById('bullet');
let enemyX = 150;
let direction = 1; // 1 = right, -1 = left
let bulletY = 30;

function moveEnemy() {
  enemyX += direction * 2;
  if (enemyX < 0 || enemyX > 350) direction *= -1;
  enemy.style.left = enemyX + 'px';

  // Shoot occasionally
  if (Math.random() < 0.03 && bullet.style.display === 'none') {
    bullet.style.display = 'block';
    bullet.style.left = (enemyX + 20) + 'px';
    bulletY = 30;
  }

  if (bullet.style.display === 'block') {
    bulletY += 5;
    bullet.style.top = bulletY + 'px';

    // Check collision with player
    const planeRect = plane.getBoundingClientRect();
    const bulletRect = bullet.getBoundingClientRect();
    if (
      planeRect.left < bulletRect.right &&
      planeRect.right > bulletRect.left &&
      planeRect.top < bulletRect.bottom &&
      planeRect.bottom > bulletRect.top
    ) {
      alert('Game Over! You were shot!');
      location.reload();
    }

    if (bulletY > 600) {
      bullet.style.display = 'none';
    }
  }

  setTimeout(moveEnemy, 30);
}
moveEnemy();
#joystick-container {
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 120px;
  height: 120px;
  touch-action: none;
}

#joystick-base {
  width: 100%;
  height: 100%;
  border: 3px solid #333;
  border-radius: 50%;
  position: relative;
  background: #eee;
}

#joystick-knob {
  width: 50px;
  height: 50px;
  background: #555;
  border-radius: 50%;
  position: absolute;
  top: 35px;
  left: 35px;
  touch-action: none;
}
