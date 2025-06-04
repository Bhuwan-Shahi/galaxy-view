'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NebulaEffectProps {
  rotation: number
}

export default function NebulaEffect({ rotation }: NebulaEffectProps) {
  const nebulaRef = useRef<THREE.Group>(null)

  // Create nebula particle system
  const nebulaGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []
    const velocities = []

    // Create multiple nebula regions
    const nebulaRegions = [
      { center: [60, 10, 20], radius: 15, color: [1, 0.3, 0.8] }, // Magenta
      { center: [-45, -8, 35], radius: 12, color: [0.3, 0.8, 1] }, // Cyan
      { center: [25, 15, -40], radius: 18, color: [0.8, 1, 0.3] }, // Green
      { center: [-60, 5, -25], radius: 10, color: [1, 0.5, 0.2] }, // Orange
    ]

    for (const region of nebulaRegions) {
      for (let i = 0; i < 800; i++) {
        // Create particles in spherical distribution around nebula center
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = Math.random() * region.radius

        const x = region.center[0] + radius * Math.sin(phi) * Math.cos(theta)
        const y = region.center[1] + radius * Math.sin(phi) * Math.sin(theta)
        const z = region.center[2] + radius * Math.cos(phi)

        positions.push(x, y, z)

        // Color variation within nebula
        const variation = 0.3
        colors.push(
          region.color[0] + (Math.random() - 0.5) * variation,
          region.color[1] + (Math.random() - 0.5) * variation,
          region.color[2] + (Math.random() - 0.5) * variation
        )

        sizes.push(Math.random() * 8 + 2)

        // Random velocities for particle movement
        velocities.push(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.02
        )
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))

    return geometry
  }, [])

  // Custom shader material for nebula particles
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: createNebulaTexture() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        uniform float time;
        varying vec3 vColor;

        void main() {
          vColor = color;

          // Animate particles
          vec3 pos = position + velocity * time * 50.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float time;
        varying vec3 vColor;

        void main() {
          vec2 coords = gl_PointCoord;
          float dist = length(coords - 0.5);

          // Create soft, glowing particles
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= 0.6;

          // Add some animation
          alpha *= 0.8 + 0.2 * sin(time * 2.0);

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    })
  }, [])

  // Create a texture for nebula particles
  function createNebulaTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32

    const context = canvas.getContext('2d')
    if (!context) return new THREE.CanvasTexture(canvas)
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    context.fillStyle = gradient
    context.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += rotation * 0.1
      // @ts-ignore
      nebulaMaterial.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <group ref={nebulaRef}>
      <points geometry={nebulaGeometry} material={nebulaMaterial} />

      {/* Additional cosmic dust effects */}
      <mesh position={[80, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          color="#661166"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-80, 10, 30]} rotation={[Math.PI / 6, 0, -Math.PI / 3]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          color="#003366"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
