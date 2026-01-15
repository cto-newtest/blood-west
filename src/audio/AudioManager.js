export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.sounds = {};
    this.isInitialized = false;
  }
  
  init() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
      this.createSounds();
      console.log('Audio system initialized');
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }
  
  createSounds() {
    this.sounds.gunshot = this.createGunshotSound();
    this.sounds.hit = this.createHitSound();
    this.sounds.draw = this.createDrawSound();
    this.sounds.victory = this.createVictorySound();
    this.sounds.defeat = this.createDefeatSound();
    this.sounds.click = this.createClickSound();
  }
  
  createGunshotSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const noiseBuffer = this.createNoiseBuffer();
      const noiseSource = this.audioContext.createBufferSource();
      const noiseGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      noiseSource.buffer = noiseBuffer;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, this.audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
      
      noiseGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.audioContext.destination);
      
      noiseSource.start();
      noiseSource.stop(this.audioContext.currentTime + 0.2);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }
  
  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }
  
  createHitSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }
  
  createDrawSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.05);
      oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.15);
    };
  }
  
  createVictorySound() {
    return () => {
      if (!this.audioContext) return;
      
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.15);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.15);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + index * 0.15 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.15 + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(this.audioContext.currentTime + index * 0.15);
        oscillator.stop(this.audioContext.currentTime + index * 0.15 + 0.3);
      });
    };
  }
  
  createDefeatSound() {
    return () => {
      if (!this.audioContext) return;
      
      const notes = [392, 349.23, 329.63, 261.63];
      notes.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.2);
        oscillator.frequency.exponentialRampToValueAtTime(freq * 0.8, this.audioContext.currentTime + index * 0.2 + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.2);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + index * 0.2 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.2 + 0.25);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(this.audioContext.currentTime + index * 0.2);
        oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.25);
      });
    };
  }
  
  createClickSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.05);
    };
  }
  
  playGunshot() {
    this.init();
    if (this.sounds.gunshot) {
      this.sounds.gunshot();
    }
  }
  
  playHit() {
    this.init();
    if (this.sounds.hit) {
      this.sounds.hit();
    }
  }
  
  playDraw() {
    this.init();
    if (this.sounds.draw) {
      this.sounds.draw();
    }
  }
  
  playVictory() {
    this.init();
    if (this.sounds.victory) {
      this.sounds.victory();
    }
  }
  
  playDefeat() {
    this.init();
    if (this.sounds.defeat) {
      this.sounds.defeat();
    }
  }
  
  playClick() {
    this.init();
    if (this.sounds.click) {
      this.sounds.click();
    }
  }
  
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
  
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  suspend() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }
}
