export class HUD {
  constructor(isMobile) {
    this.isMobile = isMobile;
  }
  
  setKillCount(count) {
    const counter = document.getElementById('kill-counter');
    if (counter) {
      counter.textContent = `Kills: ${count}`;
    }
  }
  
  setEnemyHealth(current, max) {
    const healthBar = document.getElementById('enemy-health-bar');
    if (healthBar) {
      const fill = healthBar.querySelector('.health-fill');
      if (fill) {
        const percentage = Math.max(0, (current / max) * 100);
        fill.style.width = `${percentage}%`;
      }
    }
  }
  
  showGameOver(won, kills) {
    const gameOverScreen = document.getElementById('game-over-screen');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverStats = document.getElementById('game-over-stats');
    
    if (gameOverScreen) {
      gameOverScreen.classList.remove('win', 'lose');
      gameOverScreen.classList.add(won ? 'win' : 'lose');
      gameOverScreen.style.display = 'flex';
    }
    
    if (gameOverTitle) {
      gameOverTitle.textContent = won ? 'VICTORY' : 'GAME OVER';
    }
    
    if (gameOverStats) {
      gameOverStats.textContent = `Kills: ${kills}`;
    }
  }
  
  hideGameOver() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'none';
    }
  }
  
  updatePlayerHealth(current, max) {
    const playerHealth = document.getElementById('player-health');
    if (playerHealth) {
      const fill = playerHealth.querySelector('.health-fill');
      if (fill) {
        const percentage = Math.max(0, (current / max) * 100);
        fill.style.width = `${percentage}%`;
      }
    }
  }
  
  showMessage(message, duration = 2000) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: clamp(1.5rem, 6vw, 3rem);
      color: #ffd700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
      z-index: 1000;
      pointer-events: none;
      animation: fadeInUp 0.5s ease-out;
    `;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transition = 'opacity 0.5s ease';
      setTimeout(() => messageEl.remove(), 500);
    }, duration);
  }
  
  showDamageIndicator(direction) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 4px solid rgba(255, 0, 0, 0.6);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple 0.5s ease-out forwards;
      z-index: 50;
    `;
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 500);
  }
}
