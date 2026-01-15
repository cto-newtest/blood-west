import * as THREE from 'three';

export class RagdollPhysics {
  constructor(scene) {
    this.scene = scene;
    this.ragdolls = [];
  }
  
  createRagdoll(originalMesh) {
    const ragdoll = {
      parts: [],
      velocities: [],
      constraints: [],
      active: true
    };
    
    const bodyParts = [
      { name: 'head', geometry: new THREE.SphereGeometry(0.15, 8, 8), position: new THREE.Vector3(0, 1.65, 0), mass: 2 },
      { name: 'torso', geometry: new THREE.CapsuleGeometry(0.25, 0.7, 4, 8), position: new THREE.Vector3(0, 1.1, 0), mass: 10 },
      { name: 'leftArm', geometry: new THREE.CapsuleGeometry(0.08, 0.4, 4, 8), position: new THREE.Vector3(-0.35, 1.2, 0), mass: 2 },
      { name: 'rightArm', geometry: new THREE.CapsuleGeometry(0.08, 0.4, 4, 8), position: new THREE.Vector3(0.35, 1.2, 0), mass: 2 },
      { name: 'leftLeg', geometry: new THREE.CapsuleGeometry(0.1, 0.5, 4, 8), position: new THREE.Vector3(-0.15, 0.5, 0), mass: 5 },
      { name: 'rightLeg', geometry: new THREE.CapsuleGeometry(0.1, 0.5, 4, 8), position: new THREE.Vector3(0.15, 0.5, 0), mass: 5 }
    ];
    const material = originalMesh.children[0]?.material || new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.9
    });

    bodyParts.forEach((partData, index) => {
      const mesh = new THREE.Mesh(partData.geometry, material.clone());
      
      const worldPos = originalMesh.position.clone().add(partData.position);
      mesh.position.copy(worldPos);
      
      mesh.castShadow = true;
      
      mesh.userData.mass = partData.mass;
      
      this.scene.add(mesh);
      
      ragdoll.parts.push(mesh);
      ragdoll.velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 3,
        (Math.random() - 0.5) * 2
      ));
    });
    
    ragdoll.constraints = [
      { part1: 0, part2: 1, offset1: new THREE.Vector3(0, 0.15, 0), offset2: new THREE.Vector3(0, -0.5, 0) },
      { part1: 2, part2: 1, offset1: new THREE.Vector3(0, 0.2, 0), offset2: new THREE.Vector3(-0.25, 0.3, 0) },
      { part1: 3, part2: 1, offset1: new THREE.Vector3(0, 0.2, 0), offset2: new THREE.Vector3(0.25, 0.3, 0) },
      { part1: 4, part2: 1, offset1: new THREE.Vector3(0, 0.25, 0), offset2: new THREE.Vector3(-0.15, -0.35, 0) },
      { part1: 5, part2: 1, offset1: new THREE.Vector3(0, 0.25, 0), offset2: new THREE.Vector3(0.15, -0.35, 0) }
    ];
    
    this.ragdolls.push(ragdoll);
    
    this.cleanupOriginal(originalMesh);
    
    this.animateRagdoll(ragdoll);
    
    return ragdoll;
  }
  
  cleanupOriginal(originalMesh) {
    originalMesh.visible = false;
    
    setTimeout(() => {
      this.scene.remove(originalMesh);
      originalMesh.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }, 5000);
  }
  
  animateRagdoll(ragdoll) {
    const animate = () => {
      if (!ragdoll.active) return;
      
      const dt = 1/60;
      const gravity = -9.8;
      const groundFriction = 0.8;
      const groundLevel = 0.15;
      
      ragdoll.parts.forEach((part, index) => {
        const velocity = ragdoll.velocities[index];
        
        velocity.y += gravity * dt;
        
        part.position.add(velocity.clone().multiplyScalar(dt));
        
        const rotationSpeed = 0.02;
        part.rotation.x += (Math.random() - 0.5) * rotationSpeed;
        part.rotation.z += (Math.random() - 0.5) * rotationSpeed;
        part.rotation.y += (Math.random() - 0.5) * rotationSpeed;
        
        if (part.position.y < groundLevel) {
          part.position.y = groundLevel;
          velocity.y *= -0.3;
          velocity.x *= groundFriction;
          velocity.z *= groundFriction;
        }
        
        velocity.multiplyScalar(0.98);
      });
      
      this.enforceConstraints(ragdoll);
      
      setTimeout(() => requestAnimationFrame(() => this.animateRagdoll(ragdoll)), 1000/60);
    };
    
    animate();
  }
  
  enforceConstraints(ragdoll) {
    ragdoll.constraints.forEach(constraint => {
      const part1 = ragdoll.parts[constraint.part1];
      const part2 = ragdoll.parts[constraint.part2];
      
      const worldOffset1 = constraint.offset1.clone().applyQuaternion(part1.quaternion);
      const worldOffset2 = constraint.offset2.clone().applyQuaternion(part2.quaternion);
      
      const pos1 = part1.position.clone().add(worldOffset1);
      const pos2 = part2.position.clone().add(worldOffset2);
      
      const error = pos1.clone().sub(pos2).multiplyScalar(0.1);
      
      part1.position.sub(error.clone().multiplyScalar(0.5));
      part2.position.add(error.clone().multiplyScalar(0.5));
    });
  }
  
  update(delta) {
    this.ragdolls = this.ragdolls.filter(ragdoll => {
      if (!ragdoll.active) return false;
      
      const timeSinceCreation = Date.now() - ragdoll.creationTime || 0;
      if (timeSinceCreation > 10000) {
        ragdoll.parts.forEach(part => {
          this.scene.remove(part);
          part.geometry.dispose();
          part.material.dispose();
        });
        return false;
      }
      
      return true;
    });
  }
  
  cleanup() {
    this.ragdolls.forEach(ragdoll => {
      ragdoll.active = false;
      ragdoll.parts.forEach(part => {
        this.scene.remove(part);
        if (part.geometry) part.geometry.dispose();
        if (part.material) part.material.dispose();
      });
    });
    this.ragdolls = [];
  }
}
