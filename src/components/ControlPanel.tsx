'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  RotateCw,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings
} from 'lucide-react'

interface ControlPanelProps {
  galaxyRotation: number
  setGalaxyRotation: (rotation: number) => void
  zoomLevel: number
  setZoomLevel: (zoom: number) => void
}

export default function ControlPanel({
  galaxyRotation,
  setGalaxyRotation,
  zoomLevel,
  setZoomLevel
}: ControlPanelProps) {
  const [isAutoRotating, setIsAutoRotating] = React.useState(true)

  const handlePlayPause = () => {
    if (isAutoRotating) {
      setGalaxyRotation(0)
      setIsAutoRotating(false)
    } else {
      setGalaxyRotation(0.001)
      setIsAutoRotating(true)
    }
  }

  const handleRotationSpeedChange = (value: number[]) => {
    const speed = value[0] / 1000
    setGalaxyRotation(speed)
    setIsAutoRotating(speed > 0)
  }

  const handleReverseRotation = () => {
    setGalaxyRotation(-galaxyRotation)
  }

  return (
    <Card className="w-80 bg-black/70 backdrop-blur-md border-purple-500/30 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-300">
          <Settings className="w-5 h-5" />
          Galaxy Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rotation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rotation</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReverseRotation}
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePlayPause}
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Slow</span>
              <span>Fast</span>
            </div>
            <Slider
              value={[Math.abs(galaxyRotation) * 1000]}
              onValueChange={handleRotationSpeedChange}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Zoom Level</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))}
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Close</span>
              <span>Far</span>
            </div>
            <Slider
              value={[zoomLevel]}
              onValueChange={(value) => setZoomLevel(value[0])}
              max={200}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGalaxyRotation(0.002)
                setIsAutoRotating(true)
              }}
              className="border-purple-500/50 hover:bg-purple-500/20 text-xs"
            >
              Fast Spin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setZoomLevel(50)
                setGalaxyRotation(0.001)
                setIsAutoRotating(true)
              }}
              className="border-purple-500/50 hover:bg-purple-500/20 text-xs"
            >
              Reset View
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-400 pt-2 border-t border-purple-500/20">
          Use mouse to orbit • Scroll to zoom • Click objects for info
        </div>
      </CardContent>
    </Card>
  )
}
