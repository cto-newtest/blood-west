import * as THREE from 'three';

export class DuelSystem {
  constructor(game, audioManager, isMobile) {
    this.game = game;
    this.audioManager = audioManager;
    this.isMobile = isMobile;
    
    this.state = 'waiting';
    this.canShoot = false;
    this.playerShot = false;
    this.enemyShot = false;
    this.roundActive = false;
    
    this.timerValue = 0;
    this.countdownTime = 0;
    this.countdownDuration = 3;
    
    this.enemy = null;
    this.difficulty = 'Normal';
    
    this.difficultySettings = {
      'Easy': { reactionTime: 800, accuracy: 0.6, variability: 200 },
      'Normal': { reactionTime: 500, accuracy: 0.75, variability: 100 },
      'Hard': { reactionTime: 300, accuracy: 0.9, variability: 50 }
    };
    
    this.reactionTimer = 0;
    this.reactionDelay = 0;
    this.reactionVariability = 0;
    
    this.standoffMusicPlayed = false;
  }
  
  setDifficulty(diff) {
    this.difficulty = diff;
    const settings = this.difficultySettings[diff];
    this.reactionDelay = settings.reactionTime;
    this.reactionVariability = settings.variability;
  }
  
  setEnemy(enemy) {
    this.enemy = enemy;
  }
  
  startDuel() {
    this.state = 'countdown';
    this.canShoot = false;
    this.playerShot = false;
    this.enemyShot = false;
    this.roundActive = true;
    this.timerValue = this.countdownDuration;
    this.countdownTime = 0;
    this.standoffMusicPlayed = false;
    
    this.updateTimerDisplay();
    this.showTimer();
    this.playStandoffMusic();
    
    console.log('Duel started! Countdown:', this.timerValue);
  }
  
  playStandoffMusic() {
    if (!this.standoffMusicPlayed) {
      this.standoffMusicPlayed = true;
      console.log('Playing tension music...');
    }
  }
  
  update(delta) {
    if (this.state === 'countdown') {
      this.countdownTime += delta * 1000;
      this.timerValue = Math.max(0, Math.ceil(this.countdownDuration - this.countdownTime / 1000));
      this.updateTimerDisplay();
      
      if (this.countdownTime >= this.countdownDuration * 1000) {
        this.startQuickDraw();
      }
    } else if (this.state === 'quickdraw') {
      this.handleQuickDraw(delta);
    }
  }
  
  startQuickDraw() {
    this.state = 'quickdraw';
    this.timerValue = 0;
    this.updateTimerDisplay();
    
    this.canShoot = true;
    this.showReadyIndicator();
    this.playDrawSound();
    
    this.reactionTimer = 0;
    this.reactionTimer = this.reactionDelay + (Math.random() - 0.5) * this.reactionVariability;
    
    console.log('Quick draw! Reaction time:', this.reactionTimer.toFixed(0), 'ms');
  }
  
  handleQuickDraw(delta) {
    if (this.playerShot && !this.enemyShot) {
      this.resolveDuel(true);
      return;
    }
    
    this.reactionTimer -= delta * 1000;
    
    if (this.reactionTimer <= 0 && !this.enemyShot && !this.playerShot) {
      this.enemyShoot();
    }
  }
  
  enemyShoot() {
    this.enemyShot = true;
    
    const settings = this.difficultySettings[this.difficulty];
    const hitChance = Math.random();
    
    console.log('Enemy shooting! Accuracy check:', hitChance.toFixed(2), 'vs', settings.accuracy);
    
    this.game.enemyShoot();
    
    if (hitChance < settings.accuracy) {
      setTimeout(() => {
        if (this.roundActive) {
          this.resolveDuel(false);
        }
      }, 300);
    } else {
      this.resolveDuel(true);
    }
  }
  
  resolveDuel(playerWon) {
    this.roundActive = false;
    this.canShoot = false;
    
    if (playerWon) {
      console.log('Player won the duel!');
      this.showVictory();
      this.endDuel();
    } else {
      console.log('Player lost the duel!');
      this.showDefeat();
      this.endDuel();
    }
  }
  
  showVictory() {
    const victoryMsg = document.getElementById('victory-message');
    victoryMsg.style.display = 'block';
    victoryMsg.textContent = 'YOU WON!';
    
    setTimeout(() => {
      victoryMsg.style.display = 'none';
    }, 1500);
  }
  
  showDefeat() {
    const defeatMsg = document.getElementById('defeat-message');
    defeatMsg.style.display = 'block';
    defeatMsg.textContent = 'YOU DIED';
    
    setTimeout(() => {
      defeatMsg.style.display = 'none';
    }, 1500);
  }
  
  updateTimerDisplay() {
    const timerValue = document.getElementById('timer-value');
    if (timerValue) {
      timerValue.textContent = this.timerValue > 0 ? this.timerValue : '!';
    }
  }
  
  showTimer() {
    const timerContainer = document.getElementById('duel-timer');
    if (timerContainer) {
      timerContainer.style.display = 'block';
    }
  }
  
  showReadyIndicator() {
    const timerValue = document.getElementById('timer-value');
    const timerLabel = document.getElementById('timer-label');
    
    if (timerValue) {
      timerValue.style.fontSize = 'clamp(4rem, 20vw, 10rem)';
      timerValue.textContent = '!';
      timerValue.style.color = '#ff4444';
    }
    
    if (timerLabel) {
      timerLabel.textContent = 'DRAW!';
      timerLabel.style.color = '#ff4444';
      timerLabel.style.animation = 'pulse 0.1s ease-in-out infinite';
    }
    
    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) {
      shootBtn.classList.add('ready');
    }
  }
  
  playDrawSound() {
    this.audioManager.playDraw();
  }
  
  endDuel() {
    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) {
      shootBtn.classList.remove('ready');
    }
    
    setTimeout(() => {
      const timerContainer = document.getElementById('duel-timer');
      if (timerContainer) {
        timerContainer.style.display = 'none';
      }
      
      if (!this.game.enemy.userData.alive) {
        this.game.playerDefeated();
      }
    }, 1500);
  }
  
  enemyDefeated() {
    this.roundActive = false;
    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) {
      shootBtn.classList.remove('ready');
    }
  }
  
  reset() {
    this.state = 'waiting';
    this.canShoot = false;
    this.playerShot = false;
    this.enemyShot = false;
    this.roundActive = false;
    this.timerValue = 0;
    this.countdownTime = 0;
    this.standoffMusicPlayed = false;
    
    const timerContainer = document.getElementById('duel-timer');
    if (timerContainer) {
      timerContainer.style.display = 'none';
    }
    
    const victoryMsg = document.getElementById('victory-message');
    if (victoryMsg) {
      victoryMsg.style.display = 'none';
    }
    
    const defeatMsg = document.getElementById('defeat-message');
    if (defeatMsg) {
      defeatMsg.style.display = 'none';
    }
  }
}
