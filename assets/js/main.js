// filepath: personal-website/assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section');
    const nav = document.querySelector('nav');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const navLink = nav.querySelector(`a[href="#${entry.target.id}"]`);
            if (entry.isIntersecting) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Dino Jump Game Script
(function() {
  const canvas = document.getElementById('dinoGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  let dino = { x: 40, y: h-40, w: 32, h: 32, vy: 0, jumping: false };
  let ground = h-8;
  let gravity = 0.7;
  let obstacles = [];
  let frame = 0;
  let score = 0;
  let gameOver = false;

  function drawDino() {
    ctx.save();
    ctx.fillStyle = '#00eaff';
    ctx.shadowColor = '#00eaff';
    ctx.shadowBlur = 8;
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    ctx.restore();
    // Eye
    ctx.fillStyle = '#232946';
    ctx.fillRect(dino.x + 22, dino.y + 10, 4, 4);
  }

  function drawObstacle(obs) {
    ctx.save();
    ctx.fillStyle = '#ff3cac';
    ctx.shadowColor = '#ff3cac';
    ctx.shadowBlur = 6;
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    ctx.restore();
  }

  function drawGround() {
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(0, ground, w, 8);
  }

  function resetGame() {
    dino.y = h-40;
    dino.vy = 0;
    dino.jumping = false;
    obstacles = [];
    frame = 0;
    score = 0;
    gameOver = false;
  }

  function jump() {
    if (!dino.jumping && !gameOver) {
      dino.vy = -11;
      dino.jumping = true;
    }
    if (gameOver) resetGame();
  }

  function update() {
    if (gameOver) return;
    frame++;
    // Dino physics
    dino.y += dino.vy;
    dino.vy += gravity;
    if (dino.y >= h-40) {
      dino.y = h-40;
      dino.vy = 0;
      dino.jumping = false;
    }
    // Obstacles
    if (frame % 70 === 0) {
      let obsH = 24 + Math.random()*20;
      obstacles.push({ x: w, y: ground-obsH, w: 18+Math.random()*10, h: obsH });
    }
    for (let i=0; i<obstacles.length; i++) {
      obstacles[i].x -= 5;
    }
    // Remove off-screen
    obstacles = obstacles.filter(o => o.x + o.w > 0);
    // Collision
    for (let obs of obstacles) {
      if (dino.x < obs.x + obs.w && dino.x + dino.w > obs.x && dino.y < obs.y + obs.h && dino.y + dino.h > obs.y) {
        gameOver = true;
      }
    }
    if (!gameOver) score++;
  }

  function draw() {
    ctx.clearRect(0,0,w,h);
    drawGround();
    drawDino();
    for (let obs of obstacles) drawObstacle(obs);
    ctx.fillStyle = '#b0b8c1';
    ctx.font = 'bold 18px Segoe UI, Arial';
    ctx.fillText('Score: ' + Math.floor(score/5), 10, 24);
    if (gameOver) {
      ctx.fillStyle = '#ff3cac';
      ctx.font = 'bold 22px Segoe UI, Arial';
      ctx.fillText('Game Over! Tap/Space to restart', 50, h/2);
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') jump();
  });
  canvas.addEventListener('pointerdown', jump);

  resetGame();
  loop();
})();