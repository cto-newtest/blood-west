import * as THREE from 'three';

export class PlayerController {
  constructor(camera, scene, isMobile) {
    this.camera = camera;
    this.scene = scene;
    this.isMobile = isMobile;
    
    this.health = 100;
    this.maxHealth = 100;
    
    this.headBobTimer = 0;
    this.headBobAmount = 0.02;
    this.headBobSpeed = 8;
    
    this.swayAmount = 0.002;
    this.swayTimer = 0;
    
    this.breathingAmount = 0.01;
    this.breathingSpeed = 2;
    
    this.shakeIntensity = 0;
    this.shakeTimer = 0;
    
    this.recoilAmount = 0.05;
    this.recoilRecovery = 10;
    
    this.originalCameraY = camera.position.y;
    this.currentRecoil = 0;
    
    this.createPlayer();
  }
  
  createPlayer() {
    const playerGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.CapsuleGeometry(0.25, 0.7, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.1;
    body.castShadow = true;
    playerGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.65;
    head.castShadow = true;
    playerGroup.add(head);
    
    const hatBrimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16);
    const hatBrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a0f0a,
      roughness: 0.7
    });
    const hatBrim = new THREE.Mesh(hatBrimGeometry, hatBrimMaterial);
    hatBrim.position.y = 1.8;
    playerGroup.add(hatBrim);
    
    const hatTopGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.2, 16);
    const hatTop = new THREE.Mesh(hatTopGeometry, hatBrimMaterial);
    hatTop.position.y = 1.9;
    playerGroup.add(hatTop);
    
    const vestGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.15);
    const vestMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.6
    });
    const vest = new THREE.Mesh(vestGeometry, vestMaterial);
    vest.position.y = 1.1;
    playerGroup.add(vest);
    
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 1.2, 0);
    leftArm.rotation.z = 0.3;
    playerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 1.2, 0);
    rightArm.rotation.z = -0.3;
    playerGroup.add(rightArm);
    
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
    
    pistolGroup.position.set(0.25, 0.9, 0.2);
    pistolGroup.rotation.y = 0.3;
    playerGroup.add(pistolGroup);
    
    playerGroup.position.set(0, 0, 5);
    playerGroup.userData = {
      type: 'player',
      health: this.health,
      maxHealth: this.maxHealth
    };
    
    this.player = playerGroup;
    this.scene.add(this.player);
    
    return playerGroup;
  }
  
  update(delta) {
    this.updateHeadBob(delta);
    this.updateSway(delta);
    this.updateBreathing(delta);
    this.updateShake(delta);
    this.updateRecoil(delta);
  }
  
  updateHeadBob(delta) {
    this.headBobTimer += delta * this.headBobSpeed;
    const bobOffset = Math.sin(this.headBobTimer) * this.headBobAmount;
    this.camera.position.y = this.originalCameraY + bobOffset;
  }
  
  updateSway(delta) {
    this.swayTimer += delta;
    const swayX = Math.sin(this.swayTimer * 0.5) * this.swayAmount;
    const swayY = Math.cos(this.swayTimer * 0.7) * this.swayAmount * 0.5;
    this.camera.position.x = swayX;
    this.camera.position.z = 5 + swayY;
  }
  
  updateBreathing(delta) {
    const breathOffset = Math.sin(delta * this.breathingSpeed) * this.breathingAmount;
    this.camera.position.y += breathOffset;
  }
  
  updateShake(delta) {
    if (this.shakeTimer > 0) {
      this.shakeTimer -= delta;
      const shakeOffset = (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.x += shakeOffset;
      this.camera.position.y += shakeOffset;
    }
  }
  
  updateRecoil(delta) {
    if (this.currentRecoil > 0) {
      this.currentRecoil -= delta * this.recoilRecovery;
      if (this.currentRecoil < 0) this.currentRecoil = 0;
      this.camera.position.y += this.currentRecoil * 0.01;
    }
  }
  
  takeDamage() {
    this.health -= 34;
    if (this.health < 0) this.health = 0;
    
    this.shakeIntensity = 0.1;
    this.shakeTimer = 0.2;
    
    this.updateHUD();
  }
  
  applyRecoil() {
    this.currentRecoil = this.recoilAmount;
  }
  
  updateHUD() {
    const healthFill = document.querySelector('#player-health .health-fill');
    if (healthFill) {
      const percentage = (this.health / this.maxHealth) * 100;
      healthFill.style.width = `${percentage}%`;
    }
  }
  
  reset() {
    this.health = this.maxHealth;
    this.camera.position.set(0, 1.7, 5);
    this.originalCameraY = 1.7;
    this.currentRecoil = 0;
    this.shakeTimer = 0;
    this.updateHUD();
  }
  
  get position() {
    return this.player ? this.player.position : new THREE.Vector3();
  }
}
