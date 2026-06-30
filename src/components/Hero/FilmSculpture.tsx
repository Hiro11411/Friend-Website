import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Precision-instrument sculpture — 3 interlocking torus rings +
   central lens disc. Near-black chrome. Still under pressure,
   reactive when grabbed. No particles, reduced geometry for 60fps. */

const MAT: THREE.MeshPhysicalMaterialParameters = {
  color: new THREE.Color('#0f0f0f'),
  metalness: 0.96,
  roughness: 0.07,
}

export function FilmSculpture() {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()
  const mobile = size.width < 768

  // Very slow idle rotation — just enough to be alive
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0008
  })

  const posX = mobile ? 0 : 1.65
  const scale = mobile ? 0.78 : 1.0

  return (
    <group ref={groupRef} position={[posX, 0.05, 0]} scale={scale}>
      {/* Outer gyro ring — primary ring, slightly tilted */}
      <mesh rotation={[0.22, 0, 0]}>
        <torusGeometry args={[1.78, 0.046, 16, 80]} />
        <meshPhysicalMaterial {...MAT} />
      </mesh>

      {/* Cross ring — perpendicular, creates gyroscope illusion */}
      <mesh rotation={[Math.PI / 2, 0.3, 0]}>
        <torusGeometry args={[1.78, 0.046, 16, 80]} />
        <meshPhysicalMaterial {...MAT} />
      </mesh>

      {/* Inner tilted ring — the third axis, off-angle for tension */}
      <mesh rotation={[Math.PI / 4, 0.6, Math.PI / 8]}>
        <torusGeometry args={[1.2, 0.036, 14, 64]} />
        <meshPhysicalMaterial {...MAT} />
      </mesh>

      {/* Central lens element */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.52, 0.07, 48]} />
        <meshPhysicalMaterial
          color="#090909"
          metalness={1.0}
          roughness={0.025}
        />
      </mesh>
    </group>
  )
}
