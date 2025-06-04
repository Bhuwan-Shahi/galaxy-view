'use client'

import type React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Star, Zap, Info } from 'lucide-react'

interface InfoPanelProps {
  selectedObject: string
  onClose: () => void
}

export default function InfoPanel({ selectedObject, onClose }: InfoPanelProps) {
  // Parse object information
  const getObjectInfo = (objectName: string) => {
    const [name, type] = objectName.split(' - ')

    interface ObjectInfo {
      type: string
      mass: string
      distance: string
      description: string
      facts: string[]
      icon: React.ReactNode
    }

    const objectData: Record<string, ObjectInfo> = {
      'Sagittarius A*': {
        type: 'Supermassive Black Hole',
        mass: '4.1 million solar masses',
        distance: '26,000 light-years',
        description: 'The supermassive black hole at the center of our galaxy. It has a powerful gravitational field that shapes the entire Milky Way.',
        facts: [
          'Event horizon diameter: ~24 million km',
          'Temperature: Near absolute zero',
          'Discovery: 2020 Nobel Prize in Physics'
        ],
        icon: <Zap className="w-5 h-5" />
      },
      'Betelgeuse': {
        type: 'Red Supergiant',
        mass: '15-25 solar masses',
        distance: '650 light-years',
        description: 'One of the largest known stars, expected to explode as a supernova within the next 100,000 years.',
        facts: [
          'Diameter: ~1,000 times larger than the Sun',
          'Surface temperature: ~3,500K',
          'Brightness varies by ~40%'
        ],
        icon: <Star className="w-5 h-5" />
      },
      'Rigel': {
        type: 'Blue Supergiant',
        mass: '18-24 solar masses',
        distance: '860 light-years',
        description: 'A brilliant blue supergiant star and one of the most luminous stars known in our galaxy.',
        facts: [
          'Surface temperature: ~12,000K',
          'Luminosity: 120,000 times the Sun',
          'Part of Orion constellation'
        ],
        icon: <Star className="w-5 h-5" />
      },
      'Vega': {
        type: 'Main Sequence A0V',
        mass: '2.1 solar masses',
        distance: '25 light-years',
        description: 'A relatively nearby star that served as the northern pole star around 12,000 BCE.',
        facts: [
          'First star photographed (1850)',
          'First star with spectrum recorded',
          'Used as brightness reference (magnitude 0)'
        ],
        icon: <Star className="w-5 h-5" />
      },
      'Sirius': {
        type: 'Binary Star System',
        mass: '2.0 + 1.0 solar masses',
        distance: '8.6 light-years',
        description: 'The brightest star in the night sky, consisting of a main sequence star and a white dwarf companion.',
        facts: [
          'Brightest star visible from Earth',
          'White dwarf companion: Sirius B',
          'Orbital period: 50 years'
        ],
        icon: <Star className="w-5 h-5" />
      },
      'Antares': {
        type: 'Red Supergiant',
        mass: '15-18 solar masses',
        distance: '550 light-years',
        description: 'A massive red supergiant star, one of the largest known stars by radius.',
        facts: [
          'Diameter: ~700 times larger than the Sun',
          'If placed at Sun\'s position, would engulf Mars',
          'Semi-regular variable star'
        ],
        icon: <Star className="w-5 h-5" />
      }
    }

    return objectData[name] || {
      type: type || 'Unknown Object',
      mass: 'Unknown',
      distance: 'Unknown',
      description: 'No detailed information available for this celestial object.',
      facts: ['Click other objects to learn more'],
      icon: <Info className="w-5 h-5" />
    }
  }

  const objectInfo = getObjectInfo(selectedObject)
  const [name] = selectedObject.split(' - ')

  return (
    <Card className="w-96 bg-black/80 backdrop-blur-md border-purple-500/30 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-300">
            {objectInfo.icon}
            {name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-purple-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-purple-200">{objectInfo.type}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Properties */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Mass</div>
            <div className="font-medium">{objectInfo.mass}</div>
          </div>
          <div>
            <div className="text-gray-400">Distance</div>
            <div className="font-medium">{objectInfo.distance}</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="text-gray-400 text-sm mb-2">Description</div>
          <p className="text-sm leading-relaxed">{objectInfo.description}</p>
        </div>

        {/* Facts */}
        <div>
          <div className="text-gray-400 text-sm mb-2">Key Facts</div>
          <ul className="space-y-1">
            {objectInfo.facts.map((fact: string) => (
              <li key={fact} className="text-sm flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="pt-2 border-t border-purple-500/20">
          <div className="text-xs text-gray-400">
            Click other stars and objects to explore more of the galaxy
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
