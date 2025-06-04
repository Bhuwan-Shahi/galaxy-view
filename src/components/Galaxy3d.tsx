'use client'

import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import ControlPanel from './ControlPanel'
import InfoPanel from './InfoPanel'
import GalaxyCore from './GalaxyCore'
import StarField from './StarField'
import NebulaEffect from './NebulaEffect'

export default function Galaxy3D() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [galaxyRotation, setGalaxyRotation] = useState(0.001)
  const [zoomLevel, setZoomLevel] = useState(50)

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 50, 100], fov: 60 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" />

          {/* Background stars */}
          <Stars
            radius={300}
            depth={50}
            count={8000}
            factor={4}
            saturation={0}
            fade
          />

          {/* Galaxy Components */}
          <GalaxyCore
            rotation={galaxyRotation}
            onSelect={setSelectedObject}
          />
          <StarField
            rotation={galaxyRotation}
            onSelect={setSelectedObject}
          />
          <NebulaEffect rotation={galaxyRotation} />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={20}
            maxDistance={500}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Title */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <h1 className="text-4xl font-bold text-white text-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-purple-500/30">
            Galaxy Viewer
          </h1>
        </div>

        {/* Control Panel */}
        <div className="absolute top-6 right-6 pointer-events-auto">
          <ControlPanel
            galaxyRotation={galaxyRotation}
            setGalaxyRotation={setGalaxyRotation}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
          />
        </div>

        {/* Info Panel */}
        {selectedObject && (
          <div className="absolute bottom-6 left-6 pointer-events-auto">
            <InfoPanel
              selectedObject={selectedObject}
              onClose={() => setSelectedObject(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
