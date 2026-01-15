import * as THREE from 'three';
import { Arena } from './Arena.js';
import { Lighting } from './Lighting.js';

export class WesternScene {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.arena = null;
    this.lighting = null;
  }
  
  setup() {
    this.setupSky();
    this.lighting = new Lighting(this.scene);
    this.lighting.setup();
    
    this.arena = new Arena(this.scene);
    this.arena.setup();
    
    this.setupAmbientParticles();
  }
  
  setupSky() {
    const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x1a0f0a) },
        bottomColor: { value: new THREE.Color(0x8B4513) },
        offset: { value: 20 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
    
    this.scene.background = new THREE.Color(0x8B4513);
  }
  
  setupAmbientParticles() {
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xdeb887,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(particles);
    
    this.animateParticles(particles, positions);
  }
  
  animateParticles(particles, positions) {
    const animate = () => {
      requestAnimationFrame(animate);
      
      const positionsArray = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < positionsArray.length; i += 3) {
        positionsArray[i + 1] += 0.01;
        if (positionsArray[i + 1] > 20) {
          positionsArray[i + 1] = 0;
        }
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    };
    
    animate();
  }
}
