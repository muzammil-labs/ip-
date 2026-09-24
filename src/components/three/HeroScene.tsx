import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const PALETTE = {
  light: {
    core: "#1C8C57",
    coreEmissive: "#0C4E30",
    wire: "#0C4E30",
    wireOpacity: 0.16,
    ambient: 1.15,
    key: "#FFFDF6",
    keyIntensity: 1.35,
    fill: "#1C8C57",
    fillIntensity: 0.35,
    nodes: ["#146B43", "#AD6E08", "#3652E0", "#146B43"],
  },
  dark: {
    core: "#146B43",
    coreEmissive: "#0A2E1E",
    wire: "#4FD897",
    wireOpacity: 0.28,
    ambient: 0.75,
    key: "#FAF0D9",
    keyIntensity: 1.15,
    fill: "#146B43",
    fillIntensity: 0.5,
    nodes: ["#4FD897", "#E8AE45", "#8FA8FF", "#4FD897"],
  },
} as const;

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setIsDark(el.getAttribute("data-theme") === "dark"));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

/** The evidence seal: a faceted core (the answer) orbited by four nodes (the cited bodies of law). Motivated: mirrors EvidenceGraph's four-sources-into-one-core idea, in depth. */
function EvidenceSeal({ spin, isDark }: { spin: boolean; isDark: boolean }) {
  const coreRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);
  const ringRef = useRef<Group>(null);
  const pal = isDark ? PALETTE.dark : PALETTE.light;

  const nodes = useMemo(
    () =>
      pal.nodes.map((color, i) => {
        const angle = (i / pal.nodes.length) * Math.PI * 2;
        return { angle, color };
      }),
    [pal.nodes]
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
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={pal.core}
          emissive={pal.coreEmissive}
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.03, 1]} />
        <meshBasicMaterial color={pal.wire} wireframe transparent opacity={pal.wireOpacity} />
      </mesh>
      <group ref={ringRef}>
        {nodes.map((n, i) => (
          <mesh
            key={i}
            position={[Math.cos(n.angle) * 1.55, Math.sin(n.angle) * 0.95, Math.sin(n.angle * 1.7) * 0.35]}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.5} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Lazy-loaded WebGL hero accent. Reduced motion freezes rotation but keeps the static seal for depth. Reacts to light/dark theme so it never reads as a flat dark blob on a white card. */
export default function HeroScene({ reduce = false }: { reduce?: boolean }) {
  const isDark = useIsDark();
  const pal = isDark ? PALETTE.dark : PALETTE.light;
  return (
    <Canvas
      camera={{ position: [0, 0, 6.6], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={pal.ambient} />
      <pointLight position={[3, 3, 4]} intensity={pal.keyIntensity} color={pal.key} />
      <pointLight position={[-3, -2, -2]} intensity={pal.fillIntensity} color={pal.fill} />
      <EvidenceSeal spin={!reduce} isDark={isDark} />
    </Canvas>
  );
}
