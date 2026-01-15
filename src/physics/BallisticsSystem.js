import * as THREE from 'three';

export class BallisticsSystem {
  constructor(scene) {
    this.scene = scene;
    this.bullets = [];
    this.gravity = new THREE.Vector3(0, -9.8, 0);
    this.airResistance = 0.99;
    this.bulletSpeed = 50;
  }
  
  fireBullet(from, to, isPlayer = true) {
    const bulletGeometry = new THREE.SphereGeometry(0.03, 4, 4);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    bullet.position.copy(from);
    bullet.position.y += 1.4;
    
    const direction = new THREE.Vector3().subVectors(to, from).normalize();
    direction.y += Math.random() * 0.05 - 0.025;
    
    bullet.userData = {
      velocity: direction.clone().multiplyScalar(this.bulletSpeed),
      isPlayer: isPlayer,
      traveled: 0,
      maxDistance: 100,
      createdAt: Date.now()
    };
    
    this.bullets.push(bullet);
    this.scene.add(bullet);
    
    return bullet;
  }
  
  update(delta) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      const velocity = bullet.userData.velocity;
      
      velocity.add(this.gravity.clone().multiplyScalar(delta));
      velocity.multiplyScalar(this.airResistance);
      
      bullet.position.add(velocity.clone().multiplyScalar(delta));
      bullet.userData.traveled += velocity.length() * delta;
      
      if (bullet.userData.traveled > bullet.userData.maxDistance) {
        this.removeBullet(i);
      }
      
      if (bullet.position.y < 0) {
        this.createImpactEffect(bullet.position, false);
        this.removeBullet(i);
      }
    }
  }
  
  checkHit(target) {
    const targetBox = new THREE.Box3().setFromObject(target);
    
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      if (targetBox.containsPoint(bullet.position)) {
        this.createImpactEffect(bullet.position, true);
        this.removeBullet(i);
        return true;
      }
    }
    
    return false;
  }
  
  createImpactEffect(position, isHit) {
    const particleCount = isHit ? 15 : 5;
    
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: isHit ? 0xff0000 : 0xc4a86b,
        transparent: true,
        opacity: 1
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      particle.position.copy(position);
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          Math.random() * 3,
          (Math.random() - 0.5) * 3
        ),
        life: 1
      };
      
      this.scene.add(particle);
      
      this.animateParticle(particle);
    }
    
    if (isHit) {
      this.createHitMarker(position);
    }
  }
  
  animateParticle(particle) {
    const animate = () => {
      if (!particle.parent) return;
      
      particle.userData.life -= 0.05;
      particle.userData.velocity.y -= 0.1;
      
      particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.05));
      particle.material.opacity = particle.userData.life;
      
      if (particle.userData.life > 0) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(particle);
        particle.geometry.dispose();
        particle.material.dispose();
      }
    };
    
    animate();
  }
  
  createHitMarker(position) {
    const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    ring.position.copy(position);
    ring.lookAt(new THREE.Vector3(0, 1.7, 5));
    
    this.scene.add(ring);
    
    let opacity = 0.8;
    const fadeRing = () => {
      opacity -= 0.02;
      ringMaterial.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(fadeRing);
      } else {
        this.scene.remove(ring);
        ring.geometry.dispose();
        ring.material.dispose();
      }
    };
    
    setTimeout(fadeRing, 100);
  }
  
  removeBullet(index) {
    const bullet = this.bullets[index];
    this.scene.remove(bullet);
    bullet.geometry.dispose();
    bullet.material.dispose();
    this.bullets.splice(index, 1);
  }
  
  clear() {
    while (this.bullets.length > 0) {
      this.removeBullet(0);
    }
  }
}
