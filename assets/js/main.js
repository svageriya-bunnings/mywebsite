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

// Catch the Cloud Game Script
(function() {
  const canvas = document.getElementById('cloudGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  let player = { x: 40, y: h-40, w: 32, h: 32, vy: 0, jumping: false };
  let ground = h-8;
  let gravity = 0.7;
  let clouds = [];
  let frame = 0;
  let score = 0;
  let gameOver = false;

  function drawPlayer() {
    ctx.save();
    ctx.fillStyle = '#00eaff';
    ctx.shadowColor = '#00eaff';
    ctx.shadowBlur = 8;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.restore();
    // Smile
    ctx.beginPath();
    ctx.arc(player.x+16, player.y+22, 8, 0, Math.PI, false);
    ctx.strokeStyle = '#232946';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawCloud(cloud) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, cloud.r, cloud.r*0.6, 0, 0, 2*Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawGround() {
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(0, ground, w, 8);
  }

  function resetGame() {
    player.y = h-40;
    player.vy = 0;
    player.jumping = false;
    clouds = [];
    frame = 0;
    score = 0;
    gameOver = false;
  }

  function jump() {
    if (!player.jumping && !gameOver) {
      player.vy = -11;
      player.jumping = true;
    }
    if (gameOver) resetGame();
  }

  function update() {
    if (gameOver) return;
    frame++;
    // Player physics
    player.y += player.vy;
    player.vy += gravity;
    if (player.y >= h-40) {
      player.y = h-40;
      player.vy = 0;
      player.jumping = false;
    }
    // Clouds
    if (frame % 70 === 0) {
      let r = 16 + Math.random()*12;
      clouds.push({ x: w, y: ground-30-Math.random()*40, r: r });
    }
    for (let i=0; i<clouds.length; i++) {
      clouds[i].x -= 5;
    }
    // Remove off-screen
    clouds = clouds.filter(c => c.x + c.r > 0);
    // Collision (catch cloud)
    for (let i=0; i<clouds.length; i++) {
      let c = clouds[i];
      if (player.x < c.x + c.r && player.x + player.w > c.x - c.r && player.y < c.y + c.r*0.6 && player.y + player.h > c.y - c.r*0.6) {
        score += 100;
        clouds.splice(i,1);
        i--;
      }
    }
    if (!gameOver) score++;
    // Game over if missed 3 clouds (let's say)
    if (score > 0 && frame % 350 === 0) {
      if (clouds.length > 3) gameOver = true;
    }
  }

  function draw() {
    ctx.clearRect(0,0,w,h);
    drawGround();
    drawPlayer();
    for (let c of clouds) drawCloud(c);
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