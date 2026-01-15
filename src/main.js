import { Game } from './core/Game.js';
import { InputManager } from './utils/InputManager.js';
import { AudioManager } from './audio/AudioManager.js';

class BloodWest {
  constructor() {
    this.game = null;
    this.inputManager = null;
    this.audioManager = null;
    this.isMobile = this.detectMobile();
    
    this.init();
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  }
  
  init() {
    this.audioManager = new AudioManager();
    this.inputManager = new InputManager(this.isMobile);
    this.game = new Game(this.isMobile, this.audioManager);
    
    this.setupUI();
    this.setupEventListeners();
    
    console.log('Blood West initialized');
    console.log('Mobile device:', this.isMobile);
  }
  
  setupUI() {
    const startBtn = document.getElementById('start-btn');
    const difficultyBtn = document.getElementById('difficulty-btn');
    const howToBtn = document.getElementById('how-to-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    const shootBtn = document.getElementById('shoot-btn');
    const controlsInfo = document.getElementById('controls-info');
    const desktopControls = document.getElementById('desktop-controls');
    const mobileControls = document.getElementById('mobile-controls');
    
    if (this.isMobile) {
      desktopControls.style.display = 'none';
      mobileControls.style.display = 'block';
      shootBtn.style.display = 'block';
      controlsInfo.style.display = 'block';
    } else {
      controlsInfo.style.display = 'block';
    }
    
    startBtn.addEventListener('click', () => this.startGame());
    
    difficultyBtn.addEventListener('click', () => {
      const difficulties = ['Easy', 'Normal', 'Hard'];
      const currentIndex = difficulties.indexOf(this.game.difficulty);
      const nextIndex = (currentIndex + 1) % difficulties.length;
      this.game.setDifficulty(difficulties[nextIndex]);
      difficultyBtn.textContent = `Difficulty: ${difficulties[nextIndex]}`;
    });
    
    howToBtn.addEventListener('click', () => {
      alert('HOW TO PLAY:\n\n' +
            '1. Wait for the countdown timer\n' +
            '2. When timer shows, press SPACE or tap SHOOT to fire\n' +
            '3. Be quick! First to shoot wins\n' +
            '4. Survive multiple duels to prove yourself\n\n' +
            'Tip: On mobile, tap the big red button when ready!');
    });
    
    restartBtn.addEventListener('click', () => {
      this.game.restart();
      document.getElementById('game-over-screen').style.display = 'none';
    });
    
    menuBtn.addEventListener('click', () => {
      this.game.cleanup();
      document.getElementById('game-over-screen').style.display = 'none';
      document.getElementById('main-menu').style.display = 'flex';
      document.getElementById('hud').style.display = 'none';
    });
    
    if (this.isMobile) {
      shootBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.game.playerShoot();
      });
    } else {
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && this.game.isPlaying) {
          e.preventDefault();
          this.game.playerShoot();
        }
      });
      
      document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && this.game.isPlaying) {
          this.game.playerShoot();
        }
      });
    }
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      if (this.game) {
        this.game.onResize();
      }
    });
    
    window.addEventListener('beforeunload', () => {
      if (this.game) {
        this.game.cleanup();
      }
    });
  }
  
  startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('crosshair').style.display = 'block';
    document.getElementById('shoot-btn').style.display = this.isMobile ? 'block' : 'none';
    
    this.game.start();
  }
}

new BloodWest();
