import * as THREE from 'three';
import { WesternScene } from '../world/WesternScene.js';
import { PlayerController } from './PlayerController.js';
import { DuelSystem } from './DuelSystem.js';
import { HUD } from './HUD.js';
import { RagdollPhysics } from '../physics/RagdollPhysics.js';

export class Game {
  constructor(isMobile, audioManager) {
    this.isMobile = isMobile;
    this.audioManager = audioManager;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    
    this.westernScene = null;
    this.playerController = null;
    this.duelSystem = null;
    this.hud = null;
    this.ragdollPhysics = null;
    
    this.isPlaying = false;
    this.killCount = 0;
    this.difficulty = 'Normal';
    this.difficultySettings = {
      'Easy': { reactionTime: 800, accuracy: 0.6 },
      'Normal': { reactionTime: 500, accuracy: 0.75 },
      'Hard': { reactionTime: 300, accuracy: 0.9 }
    };
    
    this.player = null;
    this.enemy = null;
    this.bullets = [];
    
    this.init();
  }
  
  init() {
    this.setupThreeJS();
    this.setupGameSystems();
    this.startAnimationLoop();
  }
  
  setupThreeJS() {
    const canvas = document.getElementById('game-canvas');
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x8B4513, 10, 100);
    this.scene.background = new THREE.Color(0x8B4513);
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.7, 5);
    this.camera.lookAt(0, 1.5, -10);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    this.clock = new THREE.Clock();
    
    window.addEventListener('resize', () => this.onResize());
  }
  
  setupGameSystems() {
    this.westernScene = new WesternScene(this.scene, this.renderer);
    this.westernScene.setup();
    
    this.playerController = new PlayerController(this.camera, this.scene, this.isMobile);
    this.player = this.playerController.createPlayer();
    
    this.duelSystem = new DuelSystem(this, this.audioManager, this.isMobile);
    this.duelSystem.setDifficulty(this.difficulty);
    
    this.hud = new HUD(this.isMobile);
    this.hud.setKillCount(0);
    
    this.ragdollPhysics = new RagdollPhysics(this.scene);
    
    this.createEnemy();
  }
  
  createEnemy() {
    const enemyGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.CapsuleGeometry(0.25, 0.7, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.9,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.1;
    body.castShadow = true;
    enemyGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.65;
    head.castShadow = true;
    enemyGroup.add(head);
    
    const hatBrimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16);
    const hatBrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f1810,
      roughness: 0.7
    });
    const hatBrim = new THREE.Mesh(hatBrimGeometry, hatBrimMaterial);
    hatBrim.position.y = 1.8;
    enemyGroup.add(hatBrim);
    
    const hatTopGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.2, 16);
    const hatTop = new THREE.Mesh(hatTopGeometry, hatBrimMaterial);
    hatTop.position.y = 1.9;
    enemyGroup.add(hatTop);
    
    const vestGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.15);
    const vestMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.6
    });
    const vest = new THREE.Mesh(vestGeometry, vestMaterial);
    vest.position.y = 1.1;
    enemyGroup.add(vest);
    
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.9
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 1.2, 0);
    leftArm.rotation.z = 0.3;
    enemyGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 1.2, 0);
    rightArm.rotation.z = -0.3;
    enemyGroup.add(rightArm);
    
    const pistolGroup = new THREE.Group();
    const pistolGripGeometry = new THREE.BoxGeometry(0.04, 0.1, 0.04);
    const pistolGripMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const pistolGrip = new THREE.Mesh(pistolGripGeometry, pistolGripMaterial);
    pistolGrip.position.y = 0.05;
    pistolGroup.add(pistolGrip);
    
    const pistolBarrelGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
    const pistolBarrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.8,
      roughness: 0.3
    });
    const pistolBarrel = new THREE.Mesh(pistolBarrelGeometry, pistolBarrelMaterial);
    pistolBarrel.rotation.x = Math.PI / 2;
    pistolBarrel.position.z = 0.1;
    pistolGroup.add(pistolBarrel);
    
    pistolGroup.position.set(0.25, 0.9, -0.1);
    pistolGroup.rotation.y = -0.3;
    enemyGroup.add(pistolGroup);
    
    enemyGroup.position.set(0, 0, -8);
    enemyGroup.userData = {
      type: 'enemy',
      health: 100,
      maxHealth: 100,
      alive: true,
      pistol: pistolGroup,
      isAiming: false,
      reactionTimer: 0,
      reactionDelay: this.difficultySettings[this.difficulty].reactionTime
    };
    
    this.enemy = enemyGroup;
    this.scene.add(this.enemy);
    
    this.duelSystem.setEnemy(this.enemy);
    this.hud.setEnemyHealth(100, 100);
  }
  
  setDifficulty(diff) {
    this.difficulty = diff;
    this.duelSystem.setDifficulty(diff);
    if (this.enemy) {
      this.enemy.userData.reactionDelay = this.difficultySettings[diff].reactionTime;
    }
  }
  
  start() {
    this.isPlaying = true;
    this.duelSystem.startDuel();
    this.hud.setKillCount(this.killCount);
  }
  
  playerShoot() {
    if (!this.isPlaying || !this.duelSystem.canShoot) return;
    
    this.duelSystem.playerShot = true;
    this.audioManager.playGunshot();
    
    this.fireBullet(this.player.position.clone(), this.enemy.position.clone(), true);
    
    if (this.enemy.userData.alive) {
      const hit = this.checkHit(this.enemy);
      if (hit) {
        this.enemy.userData.health -= 50;
        this.hud.setEnemyHealth(this.enemy.userData.health, this.enemy.userData.maxHealth);
        this.audioManager.playHit();
        
        if (this.enemy.userData.health <= 0) {
          this.enemyDefeated();
        }
      }
    }
  }
  
  enemyShoot() {
    if (!this.enemy.userData.alive) return;
    
    this.audioManager.playGunshot();
    
    this.fireBullet(this.enemy.position.clone(), this.player.position.clone(), false);
    
    this.playerController.takeDamage();
  }
  
  fireBullet(from, to, isPlayer) {
    const bulletGeometry = new THREE.SphereGeometry(0.03, 4, 4);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    bullet.position.copy(from);
    bullet.position.y += 1.4;
    
    const direction = new THREE.Vector3().subVectors(to, from).normalize();
    direction.y += Math.random() * 0.1 - 0.05;
    
    bullet.userData = {
      velocity: direction.multiplyScalar(50),
      isPlayer: isPlayer,
      traveled: 0,
      maxDistance: 100
    };
    
    this.bullets.push(bullet);
    this.scene.add(bullet);
    
    if (isPlayer) {
      this.createMuzzleFlash(from, direction);
    }
  }
  
  createMuzzleFlash(position, direction) {
    const flashGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 1
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    flash.position.y += 1.4;
    
    this.scene.add(flash);
    
    let opacity = 1;
    const fadeFlash = () => {
      opacity -= 0.2;
      flashMaterial.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(fadeFlash);
      } else {
        this.scene.remove(flash);
        flash.geometry.dispose();
        flash.material.dispose();
      }
    };
    setTimeout(fadeFlash, 50);
  }
  
  checkHit(target) {
    const targetBox = new THREE.Box3().setFromObject(target);
    return targetBox.containsPoint(target.position.clone());
  }
  
  enemyDefeated() {
    this.enemy.userData.alive = false;
    this.duelSystem.enemyDefeated();
    this.killCount++;
    this.hud.setKillCount(this.killCount);
    
    this.ragdollPhysics.createRagdoll(this.enemy);
    
    setTimeout(() => {
      this.startNextDuel();
    }, 2000);
  }
  
  playerDefeated() {
    this.isPlaying = false;
    this.duelSystem.endDuel();
    this.hud.showGameOver(false, this.killCount);
  }
  
  startNextDuel() {
    this.scene.remove(this.enemy);
    this.createEnemy();
    this.duelSystem.startDuel();
  }
  
  startAnimationLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = this.clock.getDelta();
      
      if (this.isPlaying) {
        this.updateBullets(delta);
        this.duelSystem.update(delta);
        this.playerController.update(delta);
      }
      
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }
  
  updateBullets(delta) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      const velocity = bullet.userData.velocity;
      
      bullet.position.add(velocity.clone().multiplyScalar(delta));
      bullet.userData.traveled += velocity.length() * delta;
      
      if (bullet.userData.traveled > bullet.userData.maxDistance) {
        this.scene.remove(bullet);
        this.bullets.splice(i, 1);
      }
    }
  }
  
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  restart() {
    this.killCount = 0;
    
    if (this.enemy) {
      this.scene.remove(this.enemy);
    }
    
    this.createEnemy();
    this.duelSystem.reset();
    this.hud.setKillCount(0);
    
    this.playerController.reset();
    
    this.start();
  }
  
  cleanup() {
    this.isPlaying = false;
    
    this.bullets.forEach(bullet => {
      this.scene.remove(bullet);
    });
    this.bullets = [];
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    console.log('Game cleaned up');
  }
}
