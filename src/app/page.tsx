import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Dynamically import the Galaxy3D component to avoid SSR issues with Three.js
const Galaxy3D = dynamic(() => import('../components/Galaxy3d'))

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg">Initializing Galaxy...</p>
          </div>
        </div>
      }>
        <Galaxy3D />
      </Suspense>
    </main>
  )
}
