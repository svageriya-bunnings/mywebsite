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
  let showCoffee = false;
  let started = false;
  let highScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')) : 0;

  // Display score outside canvas
  let scoreDiv = document.getElementById('snake-score');
  if (!scoreDiv) {
    scoreDiv = document.createElement('div');
    scoreDiv.id = 'snake-score';
    scoreDiv.style.textAlign = 'center';
    scoreDiv.style.fontWeight = 'bold';
    scoreDiv.style.fontSize = '1.1rem';
    scoreDiv.style.color = 'var(--neon-blue, #00eaff)';
    scoreDiv.style.margin = '0.5rem 0 0.2rem 0';
    canvas.parentNode.insertBefore(scoreDiv, canvas);
  }
  let highScoreDiv = document.getElementById('snake-highscore');
  if (!highScoreDiv) {
    highScoreDiv = document.createElement('div');
    highScoreDiv.id = 'snake-highscore';
    highScoreDiv.style.textAlign = 'center';
    highScoreDiv.style.fontWeight = 'bold';
    highScoreDiv.style.fontSize = '1.05rem';
    highScoreDiv.style.color = '#f5a623';
    highScoreDiv.style.margin = '0.1rem 0 0.2rem 0';
    scoreDiv.parentNode.insertBefore(highScoreDiv, scoreDiv.nextSibling);
  }
  let coffeeDiv = document.getElementById('coffee-message');
  if (!coffeeDiv) {
    coffeeDiv = document.createElement('div');
    coffeeDiv.id = 'coffee-message';
    coffeeDiv.style.textAlign = 'center';
    coffeeDiv.style.fontWeight = 'bold';
    coffeeDiv.style.fontSize = '1.05rem';
    coffeeDiv.style.color = '#39ff14';
    coffeeDiv.style.margin = '0.2rem 0 0.2rem 0';
    canvas.parentNode.insertBefore(coffeeDiv, canvas.nextSibling);
  }

  function resetGame() {
    snake = [{x: grid*5, y: grid*3}];
    direction = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    food = {x: grid*(2+Math.floor(Math.random()*16)), y: grid*(2+Math.floor(Math.random()*4+2))};
    score = 0;
    gameOver = false;
    lastMove = 0;
    showCoffee = false;
    started = false;
    coffeeDiv.textContent = '';
  }

  function draw() {
    ctx.clearRect(0,0,w,h);
    // Draw food
    if (started) {
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
    }
    // Game Over message
    if (gameOver) {
      ctx.fillStyle = '#ff3cac';
      ctx.font = 'bold 12px Segoe UI, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', w/2, h/2-8);
      ctx.font = 'bold 10px Segoe UI, Arial';
      ctx.fillText('Tap/Arrow/Space to restart', w/2, h/2+10);
      ctx.textAlign = 'start';
    }
    if (!started && !gameOver) {
      ctx.fillStyle = '#00eaff';
      ctx.font = 'bold 15px Segoe UI, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tap or Press Any Arrow Key to Start', w/2, h/2);
      ctx.textAlign = 'start';
    }
  }

  function moveSnake() {
    if (gameOver || !started) return;
    direction = {...nextDir};
    let head = {x: snake[0].x + direction.x*grid, y: snake[0].y + direction.y*grid};
    // Wall collision (game over)
    if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h) {
      gameOver = true;
      return;
    }
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
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
      }
      let valid = false;
      while (!valid) {
        food.x = grid * Math.floor(Math.random() * (w/grid));
        food.y = grid * Math.floor(Math.random() * (h/grid));
        // Ensure food is inside canvas and not on snake
        valid = (food.x >= 0 && food.x <= w-grid && food.y >= 0 && food.y <= h-grid) && !snake.some(s => s.x === food.x && s.y === food.y);
      }
    } else {
      snake.pop();
    }
  }

  function loop(ts) {
    if (!lastMove) lastMove = ts;
    if (!gameOver && started && ts - lastMove > moveInterval) {
      moveSnake();
      lastMove = ts;
    }
    draw();
    // Score outside canvas
    scoreDiv.textContent = 'Score: ' + score;
    highScoreDiv.textContent = 'High Score: ' + highScore;
    // Coffee message
    if (score >= 10 && !showCoffee) {
      coffeeDiv.textContent = 'You get a Free Coffee.';
      showCoffee = true;
    } else if (score < 10) {
      coffeeDiv.textContent = '';
      showCoffee = false;
    }
    requestAnimationFrame(loop);
  }

  function setDir(x, y) {
    if (!started && !gameOver) started = true;
    // Prevent reverse
    if (gameOver) { resetGame(); return; }
    if (x === -direction.x && y === -direction.y) return;
    nextDir = {x, y};
  }

  document.addEventListener('keydown', function(e) {
    if (!started && !gameOver && (e.code.startsWith('Arrow'))) started = true;
    if (e.code === 'ArrowUp') setDir(0,-1);
    else if (e.code === 'ArrowDown') setDir(0,1);
    else if (e.code === 'ArrowLeft') setDir(-1,0);
    else if (e.code === 'ArrowRight') setDir(1,0);
    else if (e.code === 'Space') { if (gameOver) resetGame(); }
  });
  canvas.addEventListener('pointerdown', function() {
    if (gameOver) resetGame();
    else if (!started) started = true;
  });
  canvas.addEventListener('touchstart', function(e) {
    if (gameOver) { resetGame(); return; }
    else if (!started) { started = true; return; }
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