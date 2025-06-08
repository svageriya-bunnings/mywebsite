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

// Classic Snake Game Script
(function() {
  const canvas = document.getElementById('cloudGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const grid = 20;
  let snake = [{x: grid*5, y: grid*3}];
  let direction = {x: 1, y: 0};
  let nextDir = {x: 1, y: 0};
  let food = {x: grid*8, y: grid*5};
  let score = 0;
  let gameOver = false;
  let moveInterval = 90;
  let lastMove = 0;

  function resetGame() {
    snake = [{x: grid*5, y: grid*3}];
    direction = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    food = {x: grid*(2+Math.floor(Math.random()*16)), y: grid*(2+Math.floor(Math.random()*4+2))};
    score = 0;
    gameOver = false;
    lastMove = 0;
  }

  function draw() {
    ctx.clearRect(0,0,w,h);
    // Draw food
    ctx.save();
    ctx.fillStyle = '#ff3cac';
    ctx.shadowColor = '#ff3cac';
    ctx.shadowBlur = 8;
    ctx.fillRect(food.x, food.y, grid, grid);
    ctx.restore();
    // Draw snake
    for (let i=0; i<snake.length; i++) {
      ctx.save();
      ctx.fillStyle = i === 0 ? '#00eaff' : '#39ff14';
      ctx.shadowColor = i === 0 ? '#00eaff' : '#39ff14';
      ctx.shadowBlur = i === 0 ? 8 : 0;
      ctx.fillRect(snake[i].x, snake[i].y, grid, grid);
      ctx.restore();
    }
    // Score
    ctx.fillStyle = '#b0b8c1';
    ctx.font = 'bold 18px Segoe UI, Arial';
    ctx.fillText('Score: ' + score, 10, 24);
    if (gameOver) {
      ctx.fillStyle = '#ff3cac';
      ctx.font = 'bold 22px Segoe UI, Arial';
      ctx.fillText('Game Over! Tap/Arrow/Space to restart', 20, h/2);
    }
  }

  function moveSnake() {
    if (gameOver) return;
    direction = {...nextDir};
    let head = {x: snake[0].x + direction.x*grid, y: snake[0].y + direction.y*grid};
    // Wall wrap
    if (head.x < 0) head.x = w-grid;
    if (head.x >= w) head.x = 0;
    if (head.y < 0) head.y = h-grid;
    if (head.y >= h) head.y = 0;
    // Self collision
    for (let i=0; i<snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver = true;
        return;
      }
    }
    snake.unshift(head);
    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score++;
      let valid = false;
      while (!valid) {
        food.x = grid * Math.floor(Math.random() * (w/grid));
        food.y = grid * Math.floor(Math.random() * (h/grid));
        valid = !snake.some(s => s.x === food.x && s.y === food.y);
      }
    } else {
      snake.pop();
    }
  }

  function loop(ts) {
    if (!lastMove) lastMove = ts;
    if (!gameOver && ts - lastMove > moveInterval) {
      moveSnake();
      lastMove = ts;
    }
    draw();
    requestAnimationFrame(loop);
  }

  function setDir(x, y) {
    // Prevent reverse
    if (gameOver) { resetGame(); return; }
    if (x === -direction.x && y === -direction.y) return;
    nextDir = {x, y};
  }

  document.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowUp') setDir(0,-1);
    else if (e.code === 'ArrowDown') setDir(0,1);
    else if (e.code === 'ArrowLeft') setDir(-1,0);
    else if (e.code === 'ArrowRight') setDir(1,0);
    else if (e.code === 'Space') { if (gameOver) resetGame(); }
  });
  canvas.addEventListener('pointerdown', function() { if (gameOver) resetGame(); });
  canvas.addEventListener('touchstart', function(e) {
    if (gameOver) { resetGame(); return; }
    // Simple swipe for mobile
    let startX = null, startY = null;
    function move(ev) {
      if (!startX) {
        startX = ev.touches[0].clientX;
        startY = ev.touches[0].clientY;
        return;
      }
      let dx = ev.touches[0].clientX - startX;
      let dy = ev.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 10) setDir(1,0);
        else if (dx < -10) setDir(-1,0);
      } else {
        if (dy > 10) setDir(0,1);
        else if (dy < -10) setDir(0,-1);
      }
      canvas.removeEventListener('touchmove', move);
    }
    canvas.addEventListener('touchmove', move);
  });

  resetGame();
  requestAnimationFrame(loop);
})();