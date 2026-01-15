import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
  }
  
  setup() {
    this.createSunlight();
    this.createAmbientLight();
    this.createFillLight();
    this.createRimLight();
    this.createVolumetricFog();
  }
  
  createSunlight() {
    const sunLight = new THREE.DirectionalLight(0xffaa55, 2);
    sunLight.position.set(-30, 15, -20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.bias = -0.0001;
    this.scene.add(sunLight);
    
    this.sunLight = sunLight;
  }
  
  createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x8B4513, 0.4);
    this.scene.add(ambientLight);
    this.ambientLight = ambientLight;
  }
  
  createFillLight() {
    const fillLight = new THREE.DirectionalLight(0x4a90d9, 0.3);
    fillLight.position.set(30, 10, 20);
    this.scene.add(fillLight);
    this.fillLight = fillLight;
  }
  
  createRimLight() {
    const rimLight = new THREE.DirectionalLight(0xff6644, 0.5);
    rimLight.position.set(0, 5, 30);
    this.scene.add(rimLight);
    this.rimLight = rimLight;
  }
  
  createVolumetricFog() {
    this.scene.fog = new THREE.FogExp2(0x8B4513, 0.015);
    
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa55,
      transparent: true,
      opacity: 0.9
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-80, 20, -50);
    this.scene.add(sun);
    this.sun = sun;
    
    const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8844,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(sun.position);
    this.scene.add(glow);
    
    const outerGlowGeometry = new THREE.SphereGeometry(25, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6622,
      transparent: true,
      opacity: 0.1
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    outerGlow.position.copy(sun.position);
    this.scene.add(outerGlow);
    
    this.animateSun();
  }
  
  animateSun() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.0001;
      
      if (this.sun) {
        this.sun.material.opacity = 0.8 + Math.sin(time) * 0.1;
      }
    };
    
    animate();
  }
  
  setTimeOfDay(hour) {
    const normalizedTime = (hour % 24) / 24;
    
    const sunsetColor = new THREE.Color(0xff6644);
    const nightColor = new THREE.Color(0x1a0f0a);
    const dayColor = new THREE.Color(0xffddaa);
    
    let sunColor, intensity, fogDensity;
    
    if (normalizedTime < 0.25) {
      sunColor = nightColor;
      intensity = 0.1;
      fogDensity = 0.02;
    } else if (normalizedTime < 0.4) {
      const t = (normalizedTime - 0.25) / 0.15;
      sunColor = new THREE.Color().lerpColors(nightColor, sunsetColor, t);
      intensity = 0.1 + t * 1.5;
      fogDensity = 0.02 - t * 0.005;
    } else if (normalizedTime < 0.6) {
      const t = (normalizedTime - 0.4) / 0.2;
      sunColor = new THREE.Color().lerpColors(sunsetColor, dayColor, t);
      intensity = 1.5 + t * 0.5;
      fogDensity = 0.015 - t * 0.005;
    } else {
      const t = Math.min(1, (normalizedTime - 0.6) / 0.4);
      sunColor = new THREE.Color().lerpColors(dayColor, sunsetColor, t);
      intensity = 2 - t * 1.5;
      fogDensity = 0.01 + t * 0.01;
    }
    
    if (this.sunLight) {
      this.sunLight.color = sunColor;
      this.sunLight.intensity = intensity;
    }
    
    if (this.scene.fog) {
      this.scene.fog.color.copy(sunColor);
      this.scene.fog.density = fogDensity;
    }
    
    this.scene.background = sunColor;
  }
}
