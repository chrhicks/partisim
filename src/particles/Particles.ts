import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'

export class Particles implements Experience {
  resources: Resource[] = []
  particleCount: number = 10000
  particles: THREE.BufferGeometry = new THREE.BufferGeometry();
  positions = new Float32Array(this.particleCount * 3);
  velocities = new Float32Array(this.particleCount * 3);
  colors = new Float32Array(this.particleCount * 3);
  particleSystem: THREE.Points = new THREE.Points()

  constructor(private engine: Engine) {}

  init() {
    // Initialize particles
    this.engine.camera.instance.position.z = 300
    // for (let i = 0; i < this.particleCount; i++) {
    //     // Random position
    //     this.positions[i * 3] = Math.random() * 20 - 10;
    //     this.positions[i * 3 + 1] = Math.random() * 20 - 10;
    //     this.positions[i * 3 + 2] = Math.random() * 20 - 10;

    //     // Random velocity
    //     this.velocities[i * 3] = Math.random() * 0.1 - 0.05;
    //     this.velocities[i * 3 + 1] = Math.random() * 0.1 - 0.05;
    //     this.velocities[i * 3 + 2] = Math.random() * 0.1 - 0.05;

    //     // Random color
    //     this.colors[i * 3] = Math.random();
    //     this.colors[i * 3 + 1] = Math.random();
    //     this.colors[i * 3 + 2] = Math.random();
    // }

    // this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    // this.particles.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const uniforms = {
      pointTexture: { value: new THREE.TextureLoader().load( 'assets/textures/sprites/disc.png' ) }
    }
    const shaderMaterial = new THREE.ShaderMaterial( {

      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexshader' )?.textContent || undefined,
      fragmentShader: document.getElementById( 'fragmentshader' )?.textContent || undefined,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true

    } );

    const radius = 500;

    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = []

    const color = new THREE.Color();

    for ( let i = 0; i < this.particleCount; i ++ ) {

      positions.push( ( Math.random() * 2 - 1 ) * radius );
      positions.push( ( Math.random() * 2 - 1 ) * radius );
      positions.push( ( Math.random() * 2 - 1 ) * radius );

      velocities.push(0.5)
      velocities.push(0.5)
      velocities.push(0.5)

      color.setHSL( i / this.particleCount, 1.0, 0.5 );

      colors.push( color.r, color.g, color.b );

      sizes.push( 20 );

    }

    this.particles.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    this.particles.setAttribute( 'velocities', new THREE.Float32BufferAttribute( velocities, 3 ) );
    this.particles.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    this.particles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    this.particleSystem = new THREE.Points(this.particles, shaderMaterial);
    this.engine.scene.add(this.particleSystem);

    console.log('velocities', velocities)
  }

  resize() {

    console.log(this.engine.sizes)
  }

  update() {
    // // Update particle positions
    // for (let i = 0; i < this.particleCount; i++) {
    //   this.positions[i * 3] += this.velocities[i * 3];
    //   this.positions[i * 3 + 1] += this.velocities[i * 3 + 1];
    //   this.positions[i * 3 + 2] += this.velocities[i * 3 + 2];

    //   // Bounce off walls
    //   if (this.positions[i * 3] > 10 || this.positions[i * 3] < -10) this.velocities[i * 3] *= -1;
    //   if (this.positions[i * 3 + 1] > 10 || this.positions[i * 3 + 1] < -10) this.velocities[i * 3 + 1] *= -1;
    //   if (this.positions[i * 3 + 2] > 10 || this.positions[i * 3 + 2] < -10) this.velocities[i * 3 + 2] *= -1;
    // }

    // this.particles.attributes.position.needsUpdate = true

    // const time = Date.now() * 0.005

    // this.particleSystem.rotation.z = 0.01 * time

    // const sizes = this.particles.attributes.size.array
    const velocities = this.particles.attributes.velocities.array
    const positions = this.particles.attributes.position.array
    // console.log(this.particles.attributes)
    for ( let i = 0; i < this.particleCount; i ++ ) {
      positions[i * 3] = positions[i * 3] + velocities[i * 3]
      positions[i * 3 + 1] = positions[i * 3 + 1] + velocities[i * 3 + 1]
      positions[i * 3+ 2] = positions[i * 3 + 2] + velocities[i * 3 + 2]
      // if (i === 9)
      //   console.log(`new position [${i}]`, positions[i], positions[i + 1], positions[i + 2])
      // sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) )
      if (positions[i * 3] > 500 || positions[i * 3] < -500) velocities[i * 3] *= -1
      if (positions[i * 3 + 1] > 500 || positions[i * 3 + 1] < -500) velocities[i * 3 + 1] *= -1
      if (positions[i * 3 + 2] > 500 || positions[i * 3 + 2] < -500) velocities[i * 3 + 2] *= -1
    }

    this.particles.attributes.size.needsUpdate = true
    this.particles.attributes.position.needsUpdate = true
    this.particles.attributes.velocities.needsUpdate = true
  }
}


