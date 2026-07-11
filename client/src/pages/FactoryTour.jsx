import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { X, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ---- Instanced sugarcane field (high density, realistic) ----
const STALK_COUNT = 700;
const FIELD_SPREAD_X = 28;
const FIELD_DEPTH = 65;
const PATH_HALF = 3.2;

// Precompute stalk positions once
const generateStalkData = () => {
  const data = [];
  let attempts = 0;
  while (data.length < STALK_COUNT && attempts < STALK_COUNT * 15) {
    attempts++;
    const x = (Math.random() - 0.5) * FIELD_SPREAD_X * 2;
    const z = -(Math.random() * FIELD_DEPTH + 4);
    // Clear dirt path but allow slight overhang
    if (Math.abs(x) < PATH_HALF) continue;
    const height = 2.6 + Math.random() * 1.8;
    const phase = Math.random() * Math.PI * 2;
    const windStrength = 0.025 + Math.random() * 0.02;
    // color variation: green -> yellow-green -> slight olive
    const colorVariant = Math.random();
    const r = colorVariant < 0.5 ? 0.32 + colorVariant * 0.1 : 0.38;
    const g = 0.52 + colorVariant * 0.12;
    const b = 0.1 + colorVariant * 0.05;
    data.push({ x, z, height, phase, windStrength, r, g, b });
  }
  return data;
};
const STALK_DATA = generateStalkData();

const SugarcaneField = () => {
  // --- Stalk segments (instanced) ---
  const SEGS_PER_STALK = 7;
  const totalSegs = STALK_DATA.length * SEGS_PER_STALK;
  const stalkMeshRef = useRef();
  const nodeMeshRef = useRef();
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  // Build initial matrices & colors
  const stalkColors = React.useMemo(() => {
    const colors = new Float32Array(totalSegs * 3);
    let idx = 0;
    STALK_DATA.forEach(s => {
      for (let seg = 0; seg < SEGS_PER_STALK; seg++) {
        const shade = 1 - seg / SEGS_PER_STALK * 0.15;
        colors[idx++] = s.r * shade;
        colors[idx++] = s.g * shade;
        colors[idx++] = s.b * shade;
      }
    });
    return colors;
  }, [totalSegs]);

  const nodeColors = React.useMemo(() => {
    const colors = new Float32Array(STALK_DATA.length * SEGS_PER_STALK * 3);
    let idx = 0;
    STALK_DATA.forEach(s => {
      for (let seg = 0; seg < SEGS_PER_STALK; seg++) {
        colors[idx++] = s.r * 1.1;
        colors[idx++] = s.g * 0.85;
        colors[idx++] = s.b * 0.5;
      }
    });
    return colors;
  }, []);

  // Leaf instanced mesh
  const LEAVES_PER_STALK = 5;
  const totalLeaves = STALK_DATA.length * LEAVES_PER_STALK;
  const leafMeshRef = useRef();
  const leafColors = React.useMemo(() => {
    const colors = new Float32Array(totalLeaves * 3);
    let idx = 0;
    STALK_DATA.forEach(s => {
      for (let l = 0; l < LEAVES_PER_STALK; l++) {
        colors[idx++] = s.r * 0.85;
        colors[idx++] = s.g * 1.05;
        colors[idx++] = s.b * 0.8;
      }
    });
    return colors;
  }, [totalLeaves]);

  // Animate wind sway
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const segLen = 0.48;

    let si = 0; // stalk instance index
    let li = 0; // leaf instance index
    STALK_DATA.forEach((s) => {
      const sway = Math.sin(t * 0.9 + s.phase) * s.windStrength;
      const swayX = Math.cos(t * 0.7 + s.phase + 1) * s.windStrength * 0.5;
      for (let seg = 0; seg < SEGS_PER_STALK; seg++) {
        const segProgress = seg / SEGS_PER_STALK;
        // More sway at top
        const localSway = sway * segProgress * segProgress;
        const localSwayX = swayX * segProgress * segProgress;
        dummy.position.set(
          s.x + localSway * seg * 0.15,
          seg * segLen + segLen / 2,
          s.z + localSwayX * seg * 0.1
        );
        dummy.rotation.set(localSwayX * 0.3, 0, localSway * 0.4);
        const taper = 1 - seg / SEGS_PER_STALK * 0.3;
        dummy.scale.set(taper, 1, taper);
        dummy.updateMatrix();
        if (stalkMeshRef.current) stalkMeshRef.current.setMatrixAt(si, dummy.matrix);
        if (nodeMeshRef.current) nodeMeshRef.current.setMatrixAt(si, dummy.matrix);
        si++;
      }

      // Leaves at top portion of stalk
      const topY = s.height;
      for (let l = 0; l < LEAVES_PER_STALK; l++) {
        const angle = (l / LEAVES_PER_STALK) * Math.PI * 2;
        const leafY = topY - (l * 0.25) - 0.3;
        const droop = 0.45 + l * 0.06;
        const leafLen = 0.8 + Math.random() * 0.5;
        const leafSway = Math.sin(t * 0.9 + s.phase + l) * s.windStrength;
        dummy.position.set(s.x + Math.cos(angle) * 0.05, leafY, s.z + Math.sin(angle) * 0.05);
        dummy.rotation.set(droop, angle, leafSway * 0.5);
        dummy.scale.set(leafLen, 1, 1);
        dummy.updateMatrix();
        if (leafMeshRef.current) leafMeshRef.current.setMatrixAt(li, dummy.matrix);
        li++;
      }
    });
    if (stalkMeshRef.current) stalkMeshRef.current.instanceMatrix.needsUpdate = true;
    if (nodeMeshRef.current) nodeMeshRef.current.instanceMatrix.needsUpdate = true;
    if (leafMeshRef.current) leafMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Stalk bodies */}
      <instancedMesh ref={stalkMeshRef} args={[null, null, totalSegs]} castShadow>
        <cylinderGeometry args={[0.038, 0.048, 0.48, 7]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>
      {/* Stalk nodes/joints */}
      <instancedMesh ref={nodeMeshRef} args={[null, null, totalSegs]}>
        <torusGeometry args={[0.042, 0.012, 6, 10]} />
        <meshStandardMaterial vertexColors roughness={0.6} />
      </instancedMesh>
      {/* Leaves */}
      <instancedMesh ref={leafMeshRef} args={[null, null, totalLeaves]} castShadow>
        <planeGeometry args={[1.1, 0.085, 1, 3]} />
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.7} />
      </instancedMesh>

      {/* Set instance colors on mount */}
      {useMemo(() => {
        // Colors are applied via useEffect below
        return null;
      }, [])}
    </group>
  );
};

// Color injection effect — runs after SugarcaneField mounts
const _applyColors = (mesh, colors) => {
  if (!mesh || mesh._colored) return;
  mesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
  mesh._colored = true;
};

// ---- Ground ----
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -20]} receiveShadow>
    <planeGeometry args={[80, 100]} />
    <meshStandardMaterial color="#6b8c3a" roughness={0.9} />
  </mesh>
);

// ---- Dirt path ----
const DirtPath = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -20]} receiveShadow>
    <planeGeometry args={[4, 100]} />
    <meshStandardMaterial color="#8B6914" roughness={1} />
  </mesh>
);

// ---- Factory building ----
const FactoryBuilding = () => (
  <group position={[0, 0, -75]}>
    {/* main hall */}
    <mesh position={[0, 4, 0]} castShadow receiveShadow>
      <boxGeometry args={[18, 8, 20]} />
      <meshStandardMaterial color="#c8c8c8" metalness={0.2} roughness={0.6} />
    </mesh>
    {/* roof */}
    <mesh position={[0, 8.5, 0]} castShadow>
      <boxGeometry args={[18, 1, 20]} />
      <meshStandardMaterial color="#aaaaaa" />
    </mesh>
    {/* chimney 1 */}
    <mesh position={[-5, 13, -4]} castShadow>
      <cylinderGeometry args={[0.6, 0.8, 10, 16]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    {/* chimney 2 */}
    <mesh position={[5, 11, -2]} castShadow>
      <cylinderGeometry args={[0.5, 0.7, 8, 16]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    {/* silo 1 */}
    <mesh position={[10, 5, 0]} castShadow>
      <cylinderGeometry args={[2.5, 2.5, 10, 32]} />
      <meshStandardMaterial color="#e0d8cc" metalness={0.1} />
    </mesh>
    <mesh position={[10, 10, 0]} castShadow>
      <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#e0d8cc" />
    </mesh>
    {/* silo 2 */}
    <mesh position={[-11, 5, 2]} castShadow>
      <cylinderGeometry args={[2, 2, 10, 32]} />
      <meshStandardMaterial color="#d8d0c4" />
    </mesh>
    {/* pipes */}
    {[[-6, -2, 3], [6, -2, 3]].map(([x, , z], i) => (
      <mesh key={i} position={[x, 3, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8, 12]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.5} />
      </mesh>
    ))}
    {/* fermentation tanks */}
    {[[-14, 4, 6], [-14, 4, -2]].map(([x, y, z], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <cylinderGeometry args={[2, 2.2, 8, 24]} />
        <meshStandardMaterial color="#607D8B" metalness={0.3} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

// ---- Steam particle ----
const SteamParticle = ({ origin }) => {
  const meshRef = useRef();
  const speed = useRef(0.3 + Math.random() * 0.4);
  const startY = useRef(Math.random() * 0.5);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = (clock.getElapsedTime() * speed.current + startY.current) % 3;
    meshRef.current.position.set(origin[0] + Math.sin(t) * 0.2, origin[1] + t, origin[2]);
    meshRef.current.material.opacity = Math.max(0, 0.5 - t / 3);
    meshRef.current.scale.setScalar(0.2 + t * 0.3);
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 6, 6]} />
      <meshStandardMaterial color="white" transparent opacity={0.4} />
    </mesh>
  );
};

const Steam = ({ origin, count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => <SteamParticle key={i} origin={origin} />)}
  </>
);

// ---- Sky ----
const SkyDome = () => {
  return (
    <mesh>
      <sphereGeometry args={[200, 32, 32]} />
      <meshStandardMaterial color="#c97a40" side={THREE.BackSide} />
    </mesh>
  );
};

// ---- Clouds ----
const Cloud = ({ position }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.05) * 5;
    }
  });
  return (
    <group ref={ref} position={position}>
      {[[-1, 0, 0], [0, 0.5, 0], [1, 0, 0], [0, 0, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[1.5 + i * 0.3, 8, 8]} />
          <meshStandardMaterial color="#f5c88a" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// ---- Hotspot label ----
const HotspotLabel = ({ position, title, desc, active, onHover, onLeave, id }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + 0.5 + Math.sin(clock.getElapsedTime() * 2 + id) * 0.1;
    }
  });
  return (
    <group ref={ref} position={[position[0], position[1], position[2]]}>
      <mesh onPointerEnter={() => onHover(id)} onPointerLeave={onLeave}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={active ? '#2ecc71' : '#f39c12'} emissive={active ? '#2ecc71' : '#f39c12'} emissiveIntensity={0.8} />
      </mesh>
      {active && (
        <Billboard>
          <mesh position={[0, 2, 0]}>
            <planeGeometry args={[4, 2]} />
            <meshStandardMaterial color="#1a3a25" transparent opacity={0.92} />
          </mesh>
          <Text position={[0, 2.4, 0.01]} fontSize={0.25} color="white" anchorX="center" maxWidth={3.5} font={undefined}>
            {title}
          </Text>
          <Text position={[0, 1.8, 0.01]} fontSize={0.18} color="#aaffaa" anchorX="center" maxWidth={3.5} font={undefined}>
            {desc}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

// ---- Camera controller driven by scroll ----
const stages = [
  { camPos: new THREE.Vector3(0, 2, 20), camTarget: new THREE.Vector3(0, 2, 0) },
  { camPos: new THREE.Vector3(0, 3, 0), camTarget: new THREE.Vector3(0, 2.5, -20) },
  { camPos: new THREE.Vector3(0, 5, -25), camTarget: new THREE.Vector3(0, 4, -50) },
  { camPos: new THREE.Vector3(6, 6, -50), camTarget: new THREE.Vector3(0, 5, -70) },
  { camPos: new THREE.Vector3(18, 12, -55), camTarget: new THREE.Vector3(0, 6, -75) },
];

const CameraDriver = ({ scrollProgress }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const lerpPos = useRef(new THREE.Vector3(0, 2, 20));
  const lerpLook = useRef(new THREE.Vector3(0, 2, 0));

  useFrame(() => {
    const total = (stages.length - 1);
    const raw = scrollProgress.current * total;
    const idx = Math.min(Math.floor(raw), total - 1);
    const t = raw - idx;
    const a = stages[idx];
    const b = stages[idx + 1] || stages[idx];
    targetPos.current.lerpVectors(a.camPos, b.camPos, t);
    targetLook.current.lerpVectors(a.camTarget, b.camTarget, t);
    lerpPos.current.lerp(targetPos.current, 0.05);
    lerpLook.current.lerp(targetLook.current, 0.05);
    camera.position.copy(lerpPos.current);
    camera.lookAt(lerpLook.current);
  });
  return null;
};

// ---- Stage label overlay ----
const stageInfo = [
  { title: 'Giai đoạn 1', sub: 'Khám phá cánh đồng mía' },
  { title: 'Giai đoạn 2', sub: 'Thu hoạch & vận chuyển mía' },
  { title: 'Giai đoạn 3', sub: 'Khu tiếp nhận nguyên liệu' },
  { title: 'Giai đoạn 4', sub: 'Dây chuyền sản xuất Ethanol' },
  { title: 'Giai đoạn 5', sub: 'Toàn cảnh nhà máy Ethanol' },
];

const hotspots = [
  { id: 0, pos: [-14, 5, -69], title: 'Bồn tiếp nhận mía', desc: 'Tiếp nhận và lưu trữ mía tươi từ ruộng.' },
  { id: 1, pos: [-6, 4, -73], title: 'Máy nghiền', desc: 'Nghiền mía để trích xuất nước mía nguyên liệu.' },
  { id: 2, pos: [-14, 5, -61], title: 'Bồn lên men', desc: 'Lên men nước mía bằng nấm men tự nhiên.' },
  { id: 3, pos: [5, 4, -73], title: 'Hệ thống chưng cất', desc: 'Chưng cất để đạt độ tinh khiết Ethanol 99.5%.' },
  { id: 4, pos: [10, 6, -75], title: 'Bồn chứa Ethanol', desc: 'Lưu trữ Ethanol thành phẩm trước khi đóng gói.' },
];

// ---- Main Scene ----
const Scene = ({ scrollProgress }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  return (
    <>
      <fog attach="fog" args={['#c97a40', 30, 120]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.2} castShadow color="#ffcc88"
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-5, 18, -75]} intensity={2} color="#ff8800" distance={30} />
      <SkyDome />
      <Cloud position={[-20, 25, -30]} />
      <Cloud position={[15, 28, -50]} />
      <Cloud position={[-10, 22, -70]} />
      <Ground />
      <DirtPath />
      <SugarcaneField />
      <FactoryBuilding />
      <Steam origin={[-5, 18, -75]} count={6} />
      <Steam origin={[5, 16, -73]} count={4} />
      {hotspots.map(h => (
        <HotspotLabel key={h.id} id={h.id} position={h.pos} title={h.title} desc={h.desc}
          active={activeHotspot === h.id} onHover={setActiveHotspot} onLeave={() => setActiveHotspot(null)} />
      ))}
      <CameraDriver scrollProgress={scrollProgress} />
    </>
  );
};

// ---- Main Page ----
const FactoryTour = () => {
  const scrollProgress = useRef(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef();

  const onWheel = useCallback((e) => {
    e.preventDefault();
    scrollProgress.current = Math.min(1, Math.max(0, scrollProgress.current + e.deltaY * 0.0006));
    const idx = Math.min(stageInfo.length - 1, Math.floor(scrollProgress.current * (stageInfo.length - 1) + 0.5));
    setStageIdx(idx);
    setShowHint(false);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden bg-[#c97a40] relative select-none">
      <Navbar />
      <Canvas
        shadows
        camera={{ position: [0, 2, 20], fov: 60 }}
        gl={{ antialias: true }}
        className="absolute inset-0"
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>

      {/* Stage label */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl px-8 py-3 border border-white/20">
          <p className="text-[#f5c88a] text-xs font-bold tracking-widest uppercase">{stageInfo[stageIdx].title}</p>
          <p className="text-white text-lg font-semibold">{stageInfo[stageIdx].sub}</p>
        </div>
      </div>

      {/* Scroll hint */}
      {showHint && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce pointer-events-none">
          <p className="text-white/80 text-sm mb-2">Cuộn để khám phá</p>
          <ChevronDown className="text-white/80 mx-auto" size={28} />
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {stageInfo.map((s, i) => (
          <button
            key={i}
            onClick={() => { scrollProgress.current = i / (stageInfo.length - 1); setStageIdx(i); setShowHint(false); }}
            className={`transition-all duration-300 rounded-full border-2 ${i === stageIdx ? 'w-4 h-4 bg-[#f5c88a] border-[#f5c88a]' : 'w-2.5 h-2.5 bg-transparent border-white/50 hover:border-white'}`}
            title={s.sub}
          />
        ))}
      </div>

      {/* Back link */}
      <div className="absolute bottom-6 left-6 z-20">
        <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Trang chủ</a>
      </div>
    </div>
  );
};

export default FactoryTour;
