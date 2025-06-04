'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarFieldProps {
  rotation: number
  onSelect: (object: string) => void
}

export default function StarField({ rotation, onSelect }: StarFieldProps) {
  const starFieldRef = useRef<THREE.Group>(null)
  const specialStarsRef = useRef<THREE.Group>(null)

  // Generate main star field
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []

    // Generate stars in a more realistic distribution
    for (let i = 0; i < 3000; i++) {
      // Create more density towards galactic plane
      const radius = 30 + Math.random() * 70
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * (10 - radius * 0.1)

      const x = Math.cos(angle) * radius
      const y = height
      const z = Math.sin(angle) * radius

      positions.push(x, y, z)

      // Different star colors based on temperature
      const temp = Math.random()
      if (temp < 0.3) {
        // Red giants
        colors.push(1.0, 0.3, 0.1)
      } else if (temp < 0.6) {
        // Yellow/orange stars
        colors.push(1.0, 0.8, 0.4)
      } else if (temp < 0.9) {
        // White stars
        colors.push(1.0, 1.0, 1.0)
      } else {
        // Blue giants
        colors.push(0.7, 0.8, 1.0)
      }

      sizes.push(Math.random() * 2 + 0.5)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    return geometry
  }, [])

  // Special notable stars
  const specialStars = useMemo(() => [
    {
      name: 'Betelgeuse',
      position: [45, 8, 12],
      color: '#ff4500',
      size: 4,
      type: 'Red Supergiant'
    },
    {
      name: 'Rigel',
      position: [38, -5, 25],
      color: '#87ceeb',
      size: 3,
      type: 'Blue Supergiant'
    },
    {
      name: 'Vega',
      position: [55, 15, -8],
      color: '#ffffff',
      size: 2.5,
      type: 'Main Sequence A0V'
    },
    {
      name: 'Sirius',
      position: [42, 3, 18],
      color: '#ffffff',
      size: 3,
      type: 'Binary Star System'
    },
    {
      name: 'Antares',
      position: [68, -12, 35],
      color: '#ff1100',
      size: 5,
      type: 'Red Supergiant'
    }
  ], [])

  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    })
  }, [])

  useFrame(() => {
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y += rotation * 0.3
    }
    if (specialStarsRef.current) {
      specialStarsRef.current.rotation.y += rotation * 0.3
      // Add twinkling effect to special stars
      specialStarsRef.current.children.forEach((star, index) => {
        if (star instanceof THREE.Mesh) {
          const time = Date.now() * 0.001
          star.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.2)
        }
      })
    }
  })

  const handleSpecialStarClick = (star: typeof specialStars[0]) => {
    onSelect(`${star.name} - ${star.type}`)
  }

  return (
    <group>
      {/* Main star field */}
      <group ref={starFieldRef}>
        <points geometry={starGeometry} material={starMaterial} />
      </group>

      {/* Special notable stars */}
      <group ref={specialStarsRef}>
        {specialStars.map((star, index) => (
          <group key={star.name}>
            {/* Main star */}
            <mesh
              position={star.position as [number, number, number]}
              onClick={() => handleSpecialStarClick(star)}
            >
              <sphereGeometry args={[star.size * 0.2, 8, 8]} />
              <meshBasicMaterial
                color={star.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Glow effect */}
            <mesh position={star.position as [number, number, number]}>
              <sphereGeometry args={[star.size * 0.8, 8, 8]} />
              <meshBasicMaterial
                color={star.color}
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Star name label */}
            <mesh position={[
              star.position[0],
              star.position[1] + star.size + 2,
              star.position[2]
            ]}>
              <planeGeometry args={[8, 2]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
