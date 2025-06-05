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
  let obsX = Math.floor(Math.random() * 370);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') posX -= 10;
    if (e.key === 'ArrowRight' || e.key === 'd') posX += 10;
    if (posX < 0) posX = 0;
    if (posX > 350) posX = 350;
    plane.style.left = posX + 'px';
  });

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
