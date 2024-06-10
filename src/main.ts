import './style.scss'
import { Engine } from './engine/Engine'
import { Particles } from './particles/Particles'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Particles
})