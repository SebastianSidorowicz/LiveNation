"use client"

import { Html } from "@react-three/drei"

export default function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="text-white mt-4 text-lg">Loading the experience...</p>
      </div>
    </Html>
  )
}
