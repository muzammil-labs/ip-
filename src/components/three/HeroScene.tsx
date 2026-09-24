import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const NODE_COLORS = ["#146B43", "#AD6E08", "#3652E0", "#146B43"] as const;

/** The evidence seal: a faceted core (the answer) orbited by four nodes (the cited bodies of law). Motivated: mirrors EvidenceGraph's four-sources-into-one-core idea, in depth. */
function EvidenceSeal({ spin }: { spin: boolean }) {
  const coreRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);
  const ringRef = useRef<Group>(null);

  const nodes = useMemo(
    () =>
      NODE_COLORS.map((color, i) => {
        const angle = (i / NODE_COLORS.length) * Math.PI * 2;
        return { angle, color };
      }),
    []
  );

  useFrame((state, delta) => {
    if (spin) {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.16;
        coreRef.current.rotation.x += delta * 0.05;
      }
      if (wireRef.current) {
        wireRef.current.rotation.y += delta * 0.16;
        wireRef.current.rotation.x += delta * 0.05;
      }
      if (ringRef.current) ringRef.current.rotation.z -= delta * 0.09;
    }
    const px = state.pointer.x * 0.55;
    const py = state.pointer.y * 0.4;
    state.camera.position.x += (px - state.camera.position.x) * 0.04;
    state.camera.position.y += (py - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color="#146B43" roughness={0.4} metalness={0.1} flatShading />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshBasicMaterial color="#4FD897" wireframe transparent opacity={0.28} />
      </mesh>
      <group ref={ringRef}>
        {nodes.map((n, i) => (
          <mesh
            key={i}
            position={[Math.cos(n.angle) * 1.75, Math.sin(n.angle) * 1.05, Math.sin(n.angle * 1.7) * 0.4]}
          >
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.45} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Lazy-loaded WebGL hero accent. Reduced motion freezes rotation but keeps the static seal for depth. */
export default function HeroScene({ reduce = false }: { reduce?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.75} />
      <pointLight position={[3, 3, 4]} intensity={1.15} color="#FAF0D9" />
      <pointLight position={[-3, -2, -2]} intensity={0.5} color="#146B43" />
      <EvidenceSeal spin={!reduce} />
    </Canvas>
  );
}
