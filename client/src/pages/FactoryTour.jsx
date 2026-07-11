import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';

// ─── COLOR PALETTE (daytime field like the photo) ────────────────────────────
const STALK_COLORS  = ['#cde8a0','#bde090','#d2eca8','#c8e89c','#b8d880'];
const LEAF_COLORS   = ['#6abf3a','#5aaf2a','#72cf42','#60b030','#7ad040'];
const NODE_COLOR    = '#a8c870';

// ─── STALK DATA (row-based planting, like real sugarcane farms) ───────────────
const ROW_SPACING  = 0.75;  // between stalks in a row
const ROW_DEPTH    = 1.1;   // between rows
const ROWS         = 55;
const STALKS_ROW   = 18;
const PATH_HALF    = 1.8;

const STALK_DATA = (() => {
  const arr = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < STALKS_ROW; col++) {
      const side = col < STALKS_ROW / 2 ? -1 : 1;
      const colInSide = col < STALKS_ROW / 2 ? col : col - STALKS_ROW / 2;
      const x = side * (PATH_HALF + 0.3 + colInSide * ROW_SPACING + Math.random() * 0.25);
      const z = -(row * ROW_DEPTH + 3 + Math.random() * 0.3);
      const height = 3.2 + Math.random() * 1.4;
      const phase  = Math.random() * Math.PI * 2;
      const wind   = 0.018 + Math.random() * 0.015;
      const ci     = Math.floor(Math.random() * STALK_COLORS.length);
      arr.push({ x, z, height, phase, wind, ci });
    }
  }
  return arr;
})();

// ─── LEAF helper: creates a long curved drooping leaf ────────────────────────
// We simulate a curved droop by stacking 3 plane segments at increasing angles
const LeafSegment = ({ position, rotation, scale, color }) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow>
    <planeGeometry args={[1, 0.09, 1, 1]} />
    <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} transparent opacity={0.95} />
  </mesh>
);

// ─── SINGLE STALK (groups with leaves, used for foreground close stalks) ──────
const Stalk = ({ data }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const sway = Math.sin(t * 0.85 + data.phase) * data.wind;
    ref.current.rotation.z = sway;
    ref.current.rotation.x = Math.cos(t * 0.65 + data.phase) * data.wind * 0.4;
  });

  const stalkColor = STALK_COLORS[data.ci];
  const leafColor  = LEAF_COLORS[data.ci];
  const h = data.height;
  const SEGS = 7;
  const segH = h / SEGS;

  return (
    <group ref={ref} position={[data.x, 0, data.z]}>
      {/* Stalk segments with tapering */}
      {Array.from({ length: SEGS }).map((_, i) => (
        <group key={i} position={[0, i * segH + segH / 2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[
              0.042 - i * 0.004,
              0.050 - i * 0.004,
              segH * 0.92, 8
            ]} />
            <meshStandardMaterial color={stalkColor} roughness={0.6} metalness={0.05} />
          </mesh>
          {/* Node ring at each joint */}
          <mesh position={[0, segH * 0.48, 0]}>
            <cylinderGeometry args={[0.055 - i * 0.004, 0.055 - i * 0.004, 0.055, 10]} />
            <meshStandardMaterial color={NODE_COLOR} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Leaves at top — long, wide, drooping curved */}
      {[0, 1, 2, 3, 4, 5].map((li) => {
        const angle  = (li / 6) * Math.PI * 2;
        const droop  = 0.55 + li * 0.05;
        const len    = 1.2 + li * 0.1;
        const leafY  = h - li * 0.18;
        return (
          <group key={li} position={[0, leafY, 0]} rotation={[0, angle, 0]}>
            {/* 3 segments to simulate curve */}
            <LeafSegment position={[len * 0.22, 0.08, 0]}  rotation={[-droop * 0.25, 0, 0]} scale={[len * 0.5, 1, 1]} color={leafColor} />
            <LeafSegment position={[len * 0.62, -0.18, 0]} rotation={[-droop * 0.7,  0, 0]} scale={[len * 0.5, 1, 1]} color={leafColor} />
            <LeafSegment position={[len * 0.95, -0.52, 0]} rotation={[-droop * 1.2,  0, 0]} scale={[len * 0.3, 1, 1]} color={leafColor} />
          </group>
        );
      })}
    </group>
  );
};

// ─── GROUND + DIRT PATH ───────────────────────────────────────────────────────
const Ground = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -28]} receiveShadow>
      <planeGeometry args={[90, 120]} />
      <meshStandardMaterial color="#7aad45" roughness={0.95} />
    </mesh>
    {/* Dirt path */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -28]} receiveShadow>
      <planeGeometry args={[3.2, 120]} />
      <meshStandardMaterial color="#b89a60" roughness={1} />
    </mesh>
  </>
);

// ─── MOUNTAINS (background hills) ────────────────────────────────────────────
const Mountains = () => (
  <group position={[0, 0, -130]}>
    {[[-30, 12, 0], [0, 18, -10], [30, 14, -5], [-60, 8, 5], [60, 10, 5], [-15, 10, -5], [18, 9, 2]].map(([x, h, dz], i) => (
      <mesh key={i} position={[x, h / 2, dz]} castShadow>
        <coneGeometry args={[h * 1.5, h, 8]} />
        <meshStandardMaterial color={i % 2 === 0 ? '#4a8a30' : '#5a9a38'} roughness={0.9} />
      </mesh>
    ))}
  </group>
);

// ─── SKY DOME ─────────────────────────────────────────────────────────────────
const SkyDome = () => (
  <mesh>
    <sphereGeometry args={[220, 32, 32]} />
    <meshStandardMaterial color="#b8ddf5" side={THREE.BackSide} />
  </mesh>
);

// ─── CLOUDS ───────────────────────────────────────────────────────────────────
const Cloud = ({ position, speed = 1 }) => {
  const ref = useRef();
  const startX = position[0];
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = startX + Math.sin(clock.getElapsedTime() * 0.04 * speed) * 8;
  });
  return (
    <group ref={ref} position={position}>
      {[[-2, 0, 0, 2.5], [0, 0.8, 0, 3], [2.5, 0.2, 0, 2.2], [-0.5, 0, 0, 1.8], [4, -0.3, 0, 1.8]].map(([cx, cy, cz, r], i) => (
        <mesh key={i} position={[cx, cy, cz]}>
          <sphereGeometry args={[r, 10, 8]} />
          <meshStandardMaterial color="white" roughness={1} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  );
};

// ─── FACTORY BUILDING ─────────────────────────────────────────────────────────
const FactoryBuilding = () => (
  <group position={[0, 0, -85]}>
    <mesh position={[0, 5, 0]} castShadow receiveShadow>
      <boxGeometry args={[22, 10, 24]} />
      <meshStandardMaterial color="#d0ccc4" roughness={0.6} metalness={0.1} />
    </mesh>
    <mesh position={[0, 10.5, 0]} castShadow>
      <boxGeometry args={[22, 1.2, 24]} />
      <meshStandardMaterial color="#b8b4ac" />
    </mesh>
    {/* Chimneys */}
    {[[-6, 16, -5, 0.7, 12], [6, 14, -3, 0.6, 10]].map(([x, h, z, r, ch], i) => (
      <mesh key={i} position={[x, h / 2, z]} castShadow>
        <cylinderGeometry args={[r, r + 0.1, ch, 14]} />
        <meshStandardMaterial color="#999890" />
      </mesh>
    ))}
    {/* Silos */}
    {[[12, 6, 0, 3], [-13, 5, 2, 2.5]].map(([x, h, z, r], i) => (
      <mesh key={i} position={[x, h / 2, z]} castShadow>
        <cylinderGeometry args={[r, r, h, 28]} />
        <meshStandardMaterial color="#e0d8cc" metalness={0.05} />
      </mesh>
    ))}
    {/* Fermentation tanks */}
    {[[-18, 5, 7], [-18, 5, -2]].map(([x, h, z], i) => (
      <mesh key={i} position={[x, h / 2, z]} castShadow>
        <cylinderGeometry args={[2.2, 2.4, h, 22]} />
        <meshStandardMaterial color="#6a7d8b" metalness={0.3} roughness={0.4} />
      </mesh>
    ))}
    {/* Pipes */}
    {[[-7, 0], [7, 0]].map(([x, _], i) => (
      <mesh key={i} position={[x, 3.5, 3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 9, 10]} />
        <meshStandardMaterial color="#4caf50" metalness={0.5} />
      </mesh>
    ))}
  </group>
);

// ─── STEAM PARTICLE ───────────────────────────────────────────────────────────
const SteamParticle = ({ origin }) => {
  const ref = useRef();
  const sp   = useRef(0.3 + Math.random() * 0.5);
  const off  = useRef(Math.random() * 3);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * sp.current + off.current) % 4;
    ref.current.position.set(origin[0] + Math.sin(t) * 0.3, origin[1] + t * 0.9, origin[2]);
    ref.current.material.opacity = Math.max(0, 0.45 - t / 5);
    ref.current.scale.setScalar(0.15 + t * 0.35);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 6, 6]} />
      <meshStandardMaterial color="white" transparent opacity={0.4} />
    </mesh>
  );
};
const Steam = ({ origin, count = 5 }) => (
  <>{Array.from({ length: count }).map((_, i) => <SteamParticle key={i} origin={origin} />)}</>
);

// ─── HOTSPOT ──────────────────────────────────────────────────────────────────
const HotspotLabel = ({ position, title, desc, active, onHover, onLeave, id }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + 0.6 + Math.sin(clock.getElapsedTime() * 2 + id) * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <mesh onPointerEnter={() => onHover(id)} onPointerLeave={onLeave}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color={active ? '#2ecc71' : '#f39c12'} emissive={active ? '#2ecc71' : '#f39c12'} emissiveIntensity={0.9} />
      </mesh>
      {active && (
        <Billboard>
          <mesh position={[0, 2.2, 0]}>
            <planeGeometry args={[4.5, 2.2]} />
            <meshStandardMaterial color="#103820" transparent opacity={0.93} />
          </mesh>
          <Text position={[0, 2.7, 0.01]} fontSize={0.27} color="#ffffff" anchorX="center" maxWidth={4}>
            {title}
          </Text>
          <Text position={[0, 2.1, 0.01]} fontSize={0.19} color="#aaffbb" anchorX="center" maxWidth={4}>
            {desc}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

// ─── CAMERA STAGES ────────────────────────────────────────────────────────────
const stages = [
  { pos: new THREE.Vector3(0, 1.8, 16),   look: new THREE.Vector3(0, 2.5, -5)   },
  { pos: new THREE.Vector3(0, 2.5, -2),   look: new THREE.Vector3(0, 3, -22)    },
  { pos: new THREE.Vector3(0, 5,  -28),   look: new THREE.Vector3(0, 4, -55)    },
  { pos: new THREE.Vector3(7, 7,  -58),   look: new THREE.Vector3(0, 5, -80)    },
  { pos: new THREE.Vector3(22, 14, -65),  look: new THREE.Vector3(0, 7, -85)    },
];

const CameraDriver = ({ scrollProgress }) => {
  const { camera } = useThree();
  const tp = useRef(new THREE.Vector3());
  const tl = useRef(new THREE.Vector3());
  const lp = useRef(new THREE.Vector3(0, 1.8, 16));
  const ll = useRef(new THREE.Vector3(0, 2.5, -5));
  useFrame(() => {
    const total = stages.length - 1;
    const raw   = scrollProgress.current * total;
    const idx   = Math.min(Math.floor(raw), total - 1);
    const t     = raw - idx;
    tp.current.lerpVectors(stages[idx].pos, stages[idx + 1]?.pos || stages[idx].pos, t);
    tl.current.lerpVectors(stages[idx].look, stages[idx + 1]?.look || stages[idx].look, t);
    lp.current.lerp(tp.current, 0.055);
    ll.current.lerp(tl.current, 0.055);
    camera.position.copy(lp.current);
    camera.lookAt(ll.current);
  });
  return null;
};

// ─── HOTSPOT DATA ─────────────────────────────────────────────────────────────
const HOTSPOTS = [
  { id: 0, pos: [-18, 5, -79], title: 'Bồn tiếp nhận mía',    desc: 'Tiếp nhận và lưu trữ mía tươi từ ruộng.' },
  { id: 1, pos: [-7,  4, -83], title: 'Máy nghiền',            desc: 'Nghiền mía để trích xuất nước mía.' },
  { id: 2, pos: [-18, 5, -70], title: 'Bồn lên men',           desc: 'Lên men nước mía bằng nấm men tự nhiên.' },
  { id: 3, pos: [6,   4, -83], title: 'Hệ thống chưng cất',   desc: 'Chưng cất đạt độ tinh khiết 99.5%.' },
  { id: 4, pos: [12,  7, -85], title: 'Bồn chứa Ethanol',     desc: 'Lưu trữ Ethanol thành phẩm.' },
];

// ─── STAGE INFO ───────────────────────────────────────────────────────────────
const STAGE_INFO = [
  { title: 'Giai đoạn 1', sub: 'Khám phá cánh đồng mía' },
  { title: 'Giai đoạn 2', sub: 'Bay qua ruộng mía' },
  { title: 'Giai đoạn 3', sub: 'Khu tiếp nhận nguyên liệu' },
  { title: 'Giai đoạn 4', sub: 'Dây chuyền sản xuất Ethanol' },
  { title: 'Giai đoạn 5', sub: 'Toàn cảnh nhà máy Ethanol' },
];

// ─── SCENE ────────────────────────────────────────────────────────────────────
const Scene = ({ scrollProgress }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  return (
    <>
      <fog attach="fog" args={['#c8eaf8', 40, 140]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 30, 10]} intensity={1.6} castShadow color="#fff8e8"
        shadow-mapSize={[2048, 2048]} shadow-camera-far={200} shadow-camera-left={-60}
        shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} />
      <hemisphereLight args={['#c8eaf8', '#7aad45', 0.4]} />

      <SkyDome />
      <Cloud position={[-35, 40, -60]} speed={0.8} />
      <Cloud position={[20,  45, -80]} speed={1.1} />
      <Cloud position={[-10, 38, -50]} speed={0.6} />
      <Cloud position={[50,  42, -70]} speed={0.9} />

      <Mountains />
      <Ground />

      {/* The sugarcane field */}
      {STALK_DATA.map((s, i) => <Stalk key={i} data={s} />)}

      <FactoryBuilding />
      <Steam origin={[-6, 22, -85]} count={7} />
      <Steam origin={[6,  20, -83]} count={5} />

      {HOTSPOTS.map(h => (
        <HotspotLabel key={h.id} id={h.id} position={h.pos} title={h.title} desc={h.desc}
          active={activeHotspot === h.id} onHover={setActiveHotspot} onLeave={() => setActiveHotspot(null)} />
      ))}
      <CameraDriver scrollProgress={scrollProgress} />
    </>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const FactoryTour = () => {
  const scrollProgress = useRef(0);
  const [stageIdx, setStageIdx]   = useState(0);
  const [showHint, setShowHint]   = useState(true);
  const containerRef = useRef();

  const onWheel = useCallback((e) => {
    e.preventDefault();
    scrollProgress.current = Math.min(1, Math.max(0, scrollProgress.current + e.deltaY * 0.0007));
    const idx = Math.min(STAGE_INFO.length - 1, Math.round(scrollProgress.current * (STAGE_INFO.length - 1)));
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
    <div ref={containerRef} className="w-full h-screen overflow-hidden bg-[#b8ddf5] relative select-none">
      <Navbar />
      <Canvas shadows camera={{ position: [0, 1.8, 16], fov: 58 }} gl={{ antialias: true }} className="absolute inset-0">
        <Scene scrollProgress={scrollProgress} />
      </Canvas>

      {/* Stage banner */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <div className="bg-black/35 backdrop-blur-md rounded-2xl px-8 py-3 border border-white/25">
          <p className="text-green-300 text-xs font-bold tracking-[0.2em] uppercase">{STAGE_INFO[stageIdx].title}</p>
          <p className="text-white text-lg font-semibold mt-0.5">{STAGE_INFO[stageIdx].sub}</p>
        </div>
      </div>

      {/* Scroll hint */}
      {showHint && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce pointer-events-none">
          <p className="text-white/80 text-sm mb-2 font-medium">Cuộn để khám phá</p>
          <ChevronDown className="text-white/80 mx-auto" size={28} />
        </div>
      )}

      {/* Stage dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {STAGE_INFO.map((s, i) => (
          <button key={i}
            onClick={() => { scrollProgress.current = i / (STAGE_INFO.length - 1); setStageIdx(i); setShowHint(false); }}
            className={`transition-all duration-300 rounded-full border-2 ${i === stageIdx ? 'w-4 h-4 bg-green-400 border-green-400' : 'w-2.5 h-2.5 bg-transparent border-white/60 hover:border-white'}`}
            title={s.sub}
          />
        ))}
      </div>

      {/* Back */}
      <div className="absolute bottom-6 left-6 z-20">
        <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Trang chủ</a>
      </div>
    </div>
  );
};

export default FactoryTour;
