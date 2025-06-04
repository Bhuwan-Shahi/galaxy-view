'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GalaxyCoreProps {
  rotation: number
  onSelect: (object: string) => void
}

export default function GalaxyCore({ rotation, onSelect }: GalaxyCoreProps) {
  const coreRef = useRef<THREE.Group>(null)
  const blackHoleRef = useRef<THREE.Mesh>(null)

  // Create spiral arms geometry
  const spiralGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []

    // Generate spiral arms
    for (let arm = 0; arm < 4; arm++) {
      const armAngle = (arm * Math.PI * 2) / 4

      for (let i = 0; i < 1000; i++) {
        const radius = 5 + Math.random() * 25
        const angle = armAngle + (i * 0.05) + Math.random() * 0.5
        const height = (Math.random() - 0.5) * 2

        const x = Math.cos(angle) * radius
        const y = height
        const z = Math.sin(angle) * radius

        positions.push(x, y, z)

        // Color gradient from center to edge
        const intensity = 1 - (radius / 30)
        colors.push(
          0.8 + intensity * 0.2, // R
          0.4 + intensity * 0.4, // G
          1.0 // B
        )

        sizes.push(Math.random() * 3 + 1)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    return geometry
  }, [])

  // Create black hole material with event horizon effect
  const blackHoleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;
          pos.x += sin(time * 2.0 + position.y * 10.0) * 0.1;
          pos.z += cos(time * 2.0 + position.y * 10.0) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float dist = length(vUv - 0.5);
          float intensity = 1.0 - dist * 2.0;
          intensity = max(0.0, intensity);

          // Create swirling effect
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float swirl = sin(angle * 8.0 + time * 4.0) * 0.5 + 0.5;

          vec3 color = vec3(0.1, 0.05, 0.2) + vec3(0.5, 0.2, 0.8) * intensity * swirl;
          gl_FragColor = vec4(color, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
  }, [])

  // Point material for spiral arms
  const spiralMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
  }, [])

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += rotation
    }

    if (blackHoleRef.current) {
      //@ts-expect-error: This property exists at runtime but TypeScript can't detect it
      blackHoleRef.current.material.uniforms.time.value = state.clock.elapsedTime
      blackHoleRef.current.rotation.z += 0.02
    }
  })

  const handleBlackHoleClick = () => {
    onSelect('Sagittarius A* - Supermassive Black Hole')
  }

  return (
    <group ref={coreRef}>
      {/* Central Black Hole */}
      <mesh
        ref={blackHoleRef}
        onClick={handleBlackHoleClick}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[3, 32, 32]} />
        <primitive object={blackHoleMaterial} />
      </mesh>

      {/* Accretion Disk */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 8, 64]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Spiral Arms */}
      <points geometry={spiralGeometry} material={spiralMaterial} />
    </group>
  )
}
