export class InputManager {
  constructor(isMobile) {
    this.isMobile = isMobile;
    
    this.keys = {
      space: false,
      w: false,
      a: false,
      s: false,
      d: false
    };
    
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false
    };
    
    this.touch = {
      isActive: false,
      x: 0,
      y: 0
    };
    
    this.gyro = {
      isSupported: false,
      x: 0,
      y: 0
    };
    
    this.eventListeners = {};
    
    this.setupEventListeners();
    this.setupGyroscope();
  }
  
  setupEventListeners() {
    if (this.isMobile) {
      this.setupTouchEvents();
    } else {
      this.setupKeyboardEvents();
      this.setupMouseEvents();
    }
  }
  
  setupKeyboardEvents() {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'Space':
          this.keys.space = true;
          this.emit('shoot');
          e.preventDefault();
          break;
        case 'KeyW':
        case 'ArrowUp':
          this.keys.w = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.a = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.s = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.d = true;
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'Space':
          this.keys.space = false;
          break;
        case 'KeyW':
        case 'ArrowUp':
          this.keys.w = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.a = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.s = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.d = false;
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    this.eventListeners.keyDown = handleKeyDown;
    this.eventListeners.keyUp = handleKeyUp;
  }
  
  setupMouseEvents() {
    const handleMouseDown = (e) => {
      this.mouse.isDown = true;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.emit('shoot');
    };
    
    const handleMouseUp = (e) => {
      this.mouse.isDown = false;
    };
    
    const handleMouseMove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };
    
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('contextmenu', handleContextMenu);
    
    this.eventListeners.mouseDown = handleMouseDown;
    this.eventListeners.mouseUp = handleMouseUp;
    this.eventListeners.mouseMove = handleMouseMove;
    this.eventListeners.contextMenu = handleContextMenu;
  }
  
  setupTouchEvents() {
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        this.touch.isActive = true;
        this.touch.x = e.touches[0].clientX;
        this.touch.y = e.touches[0].clientY;
        
        const shootBtn = document.getElementById('shoot-btn');
        if (shootBtn && shootBtn.contains(e.touches[0].target)) {
          this.emit('shoot');
        }
      }
    };
    
    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        this.touch.isActive = false;
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        this.touch.x = e.touches[0].clientX;
        this.touch.y = e.touches[0].clientY;
      }
    };
    
    const handlePreventDefault = (e) => {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchstart', handlePreventDefault, { passive: false });
    
    this.eventListeners.touchStart = handleTouchStart;
    this.eventListeners.touchEnd = handleTouchEnd;
    this.eventListeners.touchMove = handleTouchMove;
  }
  
  setupGyroscope() {
    if (window.DeviceOrientationEvent) {
      const handleOrientation = (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.gyro.isSupported = true;
          this.gyro.x = e.gamma / 90;
          this.gyro.y = (e.beta - 45) / 90;
        }
      };
      
      window.addEventListener('deviceorientation', handleOrientation);
      this.eventListeners.orientation = handleOrientation;
    }
  }
  
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }
  
  getMovement() {
    return {
      x: (this.keys.d ? 1 : 0) - (this.keys.a ? 1 : 0),
      y: (this.keys.w ? 1 : 0) - (this.keys.s ? 1 : 0)
    };
  }
  
  getMousePosition() {
    return {
      x: this.mouse.x,
      y: this.mouse.y
    };
  }
  
  getTouchPosition() {
    return {
      x: this.touch.x,
      y: this.touch.y,
      isActive: this.touch.isActive
    };
  }
  
  getGyroInput() {
    return {
      x: this.gyro.x,
      y: this.gyro.y,
      isSupported: this.gyro.isSupported
    };
  }
  
  isShooting() {
    return this.keys.space || this.mouse.isDown;
  }
  
  cleanup() {
    Object.keys(this.eventListeners).forEach(event => {
      const listener = this.eventListeners[event];
      if (typeof listener === 'function') {
        document.removeEventListener(event, listener);
      } else if (Array.isArray(listener)) {
        listener.forEach(l => document.removeEventListener(event, l));
      }
    });
    
    this.eventListeners = {};
  }
}
