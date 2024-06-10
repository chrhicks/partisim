import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'

export class Particles implements Experience {
  resources: Resource[] = []
  particleCount: number = 1000
  particles: THREE.BufferGeometry = new THREE.BufferGeometry();
  positions = new Float32Array(this.particleCount * 3);
  velocities = new Float32Array(this.particleCount * 3);
  colors = new Float32Array(this.particleCount * 3);

  constructor(private engine: Engine) {}

  init() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Initialize particles
    for (let i = 0; i < this.particleCount; i++) {
        // Random position
        this.positions[i * 3] = Math.random() * 20 - 10;
        this.positions[i * 3 + 1] = Math.random() * 20 - 10;
        this.positions[i * 3 + 2] = Math.random() * 20 - 10;

        // Random velocity
        this.velocities[i * 3] = Math.random() * 0.1 - 0.05;
        this.velocities[i * 3 + 1] = Math.random() * 0.1 - 0.05;
        this.velocities[i * 3 + 2] = Math.random() * 0.1 - 0.05;

        // Random color
        this.colors[i * 3] = Math.random();
        this.colors[i * 3 + 1] = Math.random();
        this.colors[i * 3 + 2] = Math.random();
    }

    this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.particles.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
    });

    const particleSystem = new THREE.Points(this.particles, material);
    this.engine.scene.add(particleSystem);

    camera.position.z = 30;
  }

  resize() {
  }

  update() {
    // Update particle positions
    for (let i = 0; i < this.particleCount; i++) {
      this.positions[i * 3] += this.velocities[i * 3];
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1];
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2];

      // Bounce off walls
      if (this.positions[i * 3] > 10 || this.positions[i * 3] < -10) this.velocities[i * 3] *= -1;
      if (this.positions[i * 3 + 1] > 10 || this.positions[i * 3 + 1] < -10) this.velocities[i * 3 + 1] *= -1;
      if (this.positions[i * 3 + 2] > 10 || this.positions[i * 3 + 2] < -10) this.velocities[i * 3 + 2] *= -1;
    }

    this.particles.attributes.position.needsUpdate = true
  }
}


