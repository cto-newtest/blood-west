import * as THREE from 'three';

export class Arena {
  constructor(scene) {
    this.scene = scene;
  }
  
  setup() {
    this.createGround();
    this.createSaloonFloor();
    this.createWalls();
    this.createCoverObjects();
    this.createDecorations();
    this.createPiano();
  }
  
  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] += Math.random() * 0.1;
    }
    groundGeometry.computeVertexNormals();
    
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    const sandTexture = this.createSandTexture();
    groundMaterial.map = sandTexture;
    groundMaterial.normalMap = this.createNormalMap();
    groundMaterial.needsUpdate = true;
  }
  
  createSaloonFloor() {
    const floorGeometry = new THREE.PlaneGeometry(15, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3d1e,
      roughness: 0.7,
      metalness: 0.0
    });
    
    const saloonFloor = new THREE.Mesh(floorGeometry, floorMaterial);
    saloonFloor.rotation.x = -Math.PI / 2;
    saloonFloor.position.y = 0.02;
    saloonFloor.receiveShadow = true;
    this.scene.add(saloonFloor);
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        const plankGeometry = new THREE.BoxGeometry(2.9, 0.05, 0.4);
        const plankMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0.08, 0.5, 0.25 + Math.random() * 0.1),
          roughness: 0.8
        });
        const plank = new THREE.Mesh(plankGeometry, plankMaterial);
        plank.position.set(-7 + i * 3.5, 0.05, -8 + j * 2.3);
        plank.receiveShadow = true;
        this.scene.add(plank);
      }
    }
  }
  
  createWalls() {
    this.createWall(0, 4, -15, 30, 6, 0.5, 0x4a3728);
    this.createWall(-10, 4, -2.5, 0.5, 6, 20, 0x4a3728);
    this.createWall(10, 4, -2.5, 0.5, 6, 20, 0x4a3728);
    
    const barGeometry = new THREE.BoxGeometry(8, 1.5, 0.5);
    const barMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(0, 1.5, -13);
    bar.castShadow = true;
    this.scene.add(bar);
    
    const bottles = [];
    for (let i = 0; i < 5; i++) {
      const bottleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
      const bottleMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d5016,
        transparent: true,
        opacity: 0.8
      });
      const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
      bottle.position.set(-3 + i * 0.4, 2, -13);
      bottles.push(bottle);
      this.scene.add(bottle);
    }
  }
  
  createWall(x, y, z, width, height, depth, color) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.scene.add(wall);
    
    const planks = Math.ceil(height / 0.8);
    for (let i = 0; i < planks; i++) {
      const plankGeometry = new THREE.BoxGeometry(width + 0.1, 0.75, depth + 0.1);
      const plankMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.08, 0.4, 0.2 + Math.random() * 0.1),
        roughness: 0.9
      });
      const plank = new THREE.Mesh(plankGeometry, plankMaterial);
      plank.position.set(x, 0.4 + i * 0.8, z);
      plank.castShadow = true;
      this.scene.add(plank);
    }
  }
  
  createCoverObjects() {
    const barrelPositions = [
      [-5, 0, -5], [-4, 0, -5], [-6, 0, -5],
      [5, 0, -5], [6, 0, -5],
      [-3, 0, 2], [3, 0, 2],
      [0, 0, -10]
    ];
    
    barrelPositions.forEach(([x, y, z]) => {
      this.createBarrel(x, y, z);
    });
    
    const fencePositions = [
      [-8, 0, 0], [-8, 0, 2], [-8, 0, 4],
      [8, 0, 0], [8, 0, 2], [8, 0, 4]
    ];
    
    fencePositions.forEach(([x, y, z]) => {
      this.createFencePost(x, y, z);
    });
    
    this.createTable(4, 0, 5);
    this.createTable(-4, 0, 5);
    
    this.createCrate(-7, 0, -8);
    this.createCrate(7, 0, -8);
  }
  
  createBarrel(x, y, z) {
    const barrelGroup = new THREE.Group();
    
    const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3d1e,
      roughness: 0.8
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.castShadow = true;
    barrelGroup.add(barrel);
    
    const metalBands = [0.2, 0.4, 0.6];
    metalBands.forEach(height => {
      const bandGeometry = new THREE.CylinderGeometry(0.31, 0.31, 0.05, 12);
      const bandMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.3
      });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.position.y = -0.4 + height;
      barrelGroup.add(band);
    });
    
    barrelGroup.position.set(x, y + 0.4, z);
    this.scene.add(barrelGroup);
  }
  
  createFencePost(x, y, z) {
    const postGeometry = new THREE.BoxGeometry(0.15, 1.5, 0.15);
    const postMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.9
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(x, y + 0.75, z);
    post.castShadow = true;
    this.scene.add(post);
    
    if (Math.random() > 0.5) {
      const crossbarGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.8);
      const crossbar = new THREE.Mesh(crossbarGeometry, postMaterial);
      crossbar.position.set(x, y + 1.2, z);
      crossbar.rotation.x = Math.random() > 0.5 ? 0 : Math.PI / 2;
      this.scene.add(crossbar);
    }
  }
  
  createTable(x, y, z) {
    const tableGroup = new THREE.Group();
    
    const topGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.7
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    top.castShadow = true;
    tableGroup.add(top);
    
    const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2d1f14 });
    
    const legPositions = [
      [-0.6, 0.4, -0.4],
      [0.6, 0.4, -0.4],
      [-0.6, 0.4, 0.4],
      [0.6, 0.4, 0.4]
    ];
    
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(lx, ly, lz);
      tableGroup.add(leg);
    });
    
    tableGroup.position.set(x, y, z);
    this.scene.add(tableGroup);
  }
  
  createCrate(x, y, z) {
    const crateGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const crateMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.9
    });
    const crate = new THREE.Mesh(crateGeometry, crateMaterial);
    crate.position.set(x, y + 0.4, z);
    crate.castShadow = true;
    this.scene.add(crate);
    
    for (let i = 0; i < 2; i++) {
      const plankGeometry = new THREE.BoxGeometry(0.82, 0.08, 0.82);
      const plankMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8
      });
      const plank = new THREE.Mesh(plankGeometry, plankMaterial);
      plank.position.set(x, y + 0.08 + i * 0.8, z);
      this.scene.add(plank);
    }
  }
  
  createDecorations() {
    const lanternPositions = [
      [-9, 3, -10],
      [9, 3, -10],
      [-9, 3, 5],
      [9, 3, 5]
    ];
    
    lanternPositions.forEach(([x, y, z]) => {
      this.createLantern(x, y, z);
    });
    
    this.createWantedPoster(-5, 2.5, -14.9);
    this.createWantedPoster(5, 2.5, -14.9);
  }
  
  createLantern(x, y, z) {
    const lanternGroup = new THREE.Group();
    
    const hookGeometry = new THREE.TorusGeometry(0.05, 0.02, 8, 8);
    const hookMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.position.y = 0.15;
    lanternGroup.add(hook);
    
    const glassGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.2, 8);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff99,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    lanternGroup.add(glass);
    
    const frameGeometry = new THREE.CylinderGeometry(0.11, 0.11, 0.22, 8);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    lanternGroup.add(frame);
    
    lanternGroup.position.set(x, y, z);
    this.scene.add(lanternGroup);
    
    const light = new THREE.PointLight(0xffaa00, 1, 10);
    light.position.set(x, y - 0.2, z);
    this.scene.add(light);
  }
  
  createWantedPoster(x, y, z) {
    const posterGeometry = new THREE.PlaneGeometry(0.8, 1);
    const posterMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5deb3,
      side: THREE.DoubleSide
    });
    const poster = new THREE.Mesh(posterGeometry, posterMaterial);
    poster.position.set(x, y, z);
    this.scene.add(poster);
    
    const frameGeometry = new THREE.BoxGeometry(0.85, 1.05, 0.05);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(x, y, z - 0.03);
    this.scene.add(frame);
  }
  
  createPiano() {
    const pianoGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 0.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a0f0a,
      roughness: 0.6
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    pianoGroup.add(body);
    
    const whiteKeyGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.5);
    const blackKeyGeometry = new THREE.BoxGeometry(0.05, 0.08, 0.3);
    
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff0 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    for (let i = 0; i < 15; i++) {
      const key = new THREE.Mesh(whiteKeyGeometry, whiteMaterial);
      key.position.set(-0.6 + i * 0.1, 1.32, 0.05);
      pianoGroup.add(key);
    }
    
    const blackKeyPositions = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14];
    blackKeyPositions.forEach(pos => {
      const key = new THREE.Mesh(blackKeyGeometry, blackMaterial);
      key.position.set(-0.55 + pos * 0.1, 1.35, 0.08);
      pianoGroup.add(key);
    });
    
    pianoGroup.position.set(-6, 0, -12);
    this.scene.add(pianoGroup);
  }
  
  createSandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, 0, 256, 256);
    
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(${139 + Math.random() * 20}, ${115 + Math.random() * 20}, ${85 + Math.random() * 20}, 0.3)`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    
    return texture;
  }
  
  createNormalMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }
}
