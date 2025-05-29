"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Box, Cylinder, Sphere } from "@react-three/drei"
import type * as THREE from "three"

export default function ShowEntrance() {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <Box args={[30, 0.2, 30]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>

      {/* Main entrance structure */}
      <group position={[0, 0, -5]}>
        {/* Entrance pillars */}
        <Cylinder args={[0.5, 0.5, 8]} position={[-4, 4, 0]}>
          <meshStandardMaterial color="#2d2d44" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 8]} position={[4, 4, 0]}>
          <meshStandardMaterial color="#2d2d44" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Entrance arch */}
        <Box args={[9, 1, 1]} position={[0, 7.5, 0]}>
          <meshStandardMaterial color="#2d2d44" metalness={0.8} roughness={0.2} />
        </Box>

        {/* Entrance doors */}
        <Box
          args={[3.5, 6, 0.2]}
          position={[-2, 3, 0.1]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial color={hovered ? "#ff6b6b" : "#8b0000"} metalness={0.6} roughness={0.3} />
        </Box>
        <Box
          args={[3.5, 6, 0.2]}
          position={[2, 3, 0.1]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial color={hovered ? "#ff6b6b" : "#8b0000"} metalness={0.6} roughness={0.3} />
        </Box>

        {/* Door handles */}
        <Sphere args={[0.1]} position={[-0.5, 3, 0.3]}>
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </Sphere>
        <Sphere args={[0.1]} position={[0.5, 3, 0.3]}>
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </Sphere>
      </group>

      {/* Stage platform */}
      <Box args={[20, 1, 15]} position={[0, 0.5, -15]}>
        <meshStandardMaterial color="#4a4a6a" metalness={0.3} roughness={0.7} />
      </Box>

      {/* Curtains */}
      <Box args={[0.2, 10, 15]} position={[-10, 5, -15]}>
        <meshStandardMaterial color="#8b0000" />
      </Box>
      <Box args={[0.2, 10, 15]} position={[10, 5, -15]}>
        <meshStandardMaterial color="#8b0000" />
      </Box>

      {/* Floating orbs for ambiance */}
      {Array.from({ length: 8 }, (_, i) => (
        <FloatingOrb
          key={i}
          position={[(Math.random() - 0.5) * 25, Math.random() * 8 + 2, (Math.random() - 0.5) * 25]}
        />
      ))}

      {/* Welcome text */}
      <Text position={[0, 9, -5]} fontSize={1.5} color="#ffd700" anchorX="center" anchorY="middle">
        WELCOME TO THE SHOW
      </Text>

      {/* Subtitle */}
      <Text position={[0, 7.8, -5]} fontSize={0.6} color="#ffffff" anchorX="center" anchorY="middle">
        An Interactive 3D Experience
      </Text>
    </group>
  )
}

function FloatingOrb({ position }: { position: [number, number, number] }) {
  const orbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
      orbRef.current.rotation.x = state.clock.elapsedTime * 0.5
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Sphere ref={orbRef} args={[0.2]} position={position}>
      <meshStandardMaterial color="#4ecdc4" emissive="#4ecdc4" emissiveIntensity={0.3} transparent opacity={0.8} />
    </Sphere>
  )
}
