import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';

// ─── FIELD SETTINGS ────────────────────────────────────────────────────────
const STALK_COUNT   = 400;   // total stalks (InstancedMesh = 1 draw call)
const SEGS_PER_STALK = 6;
const LEAVES_PER_STALK = 4;
const LEAF_SEGS      = 2;
const PATH_HALF      = 2.0;

// ─── PRECOMPUTE STALK DATA ─────────────────────────────────────────────────
const STALK_DATA = (() => {
  const arr = [];
  const ROWS = 25, PER_ROW = 16;
  for (let row = 0; row < ROWS && arr.length < STALK_COUNT; row++) {
    for (let col = 0; col < PER_ROW && arr.length < STALK_COUNT; col++) {
      const side = col < PER_ROW / 2 ? -1 : 1;
      const colIdx = col < PER_ROW / 2 ? col : col - PER_ROW / 2;
      const x = side * (PATH_HALF + 0.4 + colIdx * 0.75 + (Math.random() - 0.5) * 0.3);
      const z = -(row * 1.1 + 3 + (Math.random() - 0.5) * 0.3);
      const h = 3.0 + Math.random() * 1.6;
      arr.push({ x, z, h, phase: Math.random() * Math.PI * 2, wind: 0.018 + Math.random() * 0.014 });
    }
  }
  return arr;
})();

const TOTAL_SEGS   = STALK_DATA.length * SEGS_PER_STALK;
const TOTAL_NODES  = STALK_DATA.length * SEGS_PER_STALK;
const TOTAL_LEAVES = STALK_DATA.length * LEAVES_PER_STALK * LEAF_SEGS;

// ─── INSTANCED SUGARCANE FIELD (3 draw calls total) ────────────────────────
const SugarcaneField = () => {
  const stalkRef = useRef();
  const nodeRef  = useRef();
  const leafRef  = useRef();
  const dummy    = new THREE.Object3D();
  const stalkColor = new THREE.Color();
  const leafColor  = new THREE.Color();
  const nodeColor  = new THREE.Color('#a8c870');

  // Set per-instance colors once on mount
  useEffect(() => {
    if (!stalkRef.current || !nodeRef.current || !leafRef.current) return;
    const stalkPalette = ['#cde8a0','#bde090','#d2eca8','#c8e89c','#b8d880'];
    const leafPalette  = ['#5aaf2a','#4a9f1a','#6abf3a','#50a020','#72cf42'];
    let si = 0, li = 0;
    STALK_DATA.forEach((s, idx) => {
      const sc = stalkPalette[idx % stalkPalette.length];
      const lc = leafPalette[idx % leafPalette.length];
      for (let seg = 0; seg < SEGS_PER_STALK; seg++) {
        stalkColor.set(sc);
        stalkRef.current.setColorAt(si, stalkColor);
        nodeColor.set('#a8c870');
        nodeRef.current.setColorAt(si, nodeColor);
        si++;
      }
      for (let leaf = 0; leaf < LEAVES_PER_STALK * LEAF_SEGS; leaf++) {
        leafColor.set(lc);
        leafRef.current.setColorAt(li, leafColor);
        li++;
      }
    });
    stalkRef.current.instanceColor.needsUpdate = true;
    nodeRef.current.instanceColor.needsUpdate  = true;
    leafRef.current.instanceColor.needsUpdate  = true;
  }, []);

  // Animate per frame (update instance matrices)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const SEG_H = 0.5;
    let si = 0, li = 0;

    STALK_DATA.forEach((s) => {
      const sway  = Math.sin(t * 0.85 + s.phase) * s.wind;
      const swayX = Math.cos(t * 0.65 + s.phase + 1.2) * s.wind * 0.4;

      // Stalk segments
      for (let seg = 0; seg < SEGS_PER_STALK; seg++) {
        const progress = seg / SEGS_PER_STALK;
        const ls = sway  * progress * progress;
        const lx = swayX * progress * progress;
        dummy.position.set(s.x + ls * seg * 0.12, seg * SEG_H + SEG_H / 2, s.z + lx * seg * 0.08);
        dummy.rotation.set(lx * 0.25, 0, ls * 0.35);
        const taper = 1 - progress * 0.28;
        dummy.scale.set(taper, 1, taper);
        dummy.updateMatrix();
        stalkRef.current?.setMatrixAt(si, dummy.matrix);
        nodeRef.current?.setMatrixAt(si, dummy.matrix);
        si++;
      }

      // Leaves at top
      for (let leaf = 0; leaf < LEAVES_PER_STALK; leaf++) {
        const angle  = (leaf / LEAVES_PER_STALK) * Math.PI * 2;
        const baseY  = s.h - leaf * 0.22 - 0.25;
        const droop  = 0.5 + leaf * 0.06;
        const leafLen = 1.0 + leaf * 0.08;
        const lsway  = sway * 0.6;

        // Segment 1 (upper)
        dummy.position.set(s.x + Math.cos(angle) * 0.1, baseY + 0.05, s.z + Math.sin(angle) * 0.1);
        dummy.rotation.set(-droop * 0.3, angle, lsway);
        dummy.scale.set(leafLen * 0.55, 1, 1);
        dummy.updateMatrix();
        leafRef.current?.setMatrixAt(li, dummy.matrix);
        li++;

        // Segment 2 (lower, more drooped)
        dummy.position.set(
          s.x + Math.cos(angle) * (leafLen * 0.38),
          baseY - 0.22,
          s.z + Math.sin(angle) * (leafLen * 0.38)
        );
        dummy.rotation.set(-droop * 0.9, angle, lsway * 0.8);
        dummy.scale.set(leafLen * 0.5, 1, 1);
        dummy.updateMatrix();
        leafRef.current?.setMatrixAt(li, dummy.matrix);
        li++;
      }
    });

    if (stalkRef.current) stalkRef.current.instanceMatrix.needsUpdate = true;
    if (nodeRef.current)  nodeRef.current.instanceMatrix.needsUpdate  = true;
    if (leafRef.current)  leafRef.current.instanceMatrix.needsUpdate  = true;
  });

  return (
    <group>
      {/* All stalk cylinders — 1 draw call */}
      <instancedMesh ref={stalkRef} args={[null, null, TOTAL_SEGS]}>
        <cylinderGeometry args={[0.04, 0.052, 0.5, 7]} />
        <meshStandardMaterial roughness={0.65} />
      </instancedMesh>

      {/* All nodes — 1 draw call */}
      <instancedMesh ref={nodeRef} args={[null, null, TOTAL_NODES]}>
        <cylinderGeometry args={[0.058, 0.058, 0.055, 8]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>

      {/* All leaves — 1 draw call */}
      <instancedMesh ref={leafRef} args={[null, null, TOTAL_LEAVES]}>
        <planeGeometry args={[1, 0.095]} />
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.75} />
      </instancedMesh>
    </group>
  );
};

// ─── GROUND + PATH ─────────────────────────────────────────────────────────
const Ground = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -22]} receiveShadow>
      <planeGeometry args={[90, 110]} />
      <meshStandardMaterial color="#7aad45" roughness={0.95} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -22]}>
      <planeGeometry args={[3.6, 110]} />
      <meshStandardMaterial color="#b89a60" roughness={1} />
    </mesh>
  </>
);

// ─── MOUNTAINS ─────────────────────────────────────────────────────────────
const Mountains = () => (
  <group position={[0, 0, -120]}>
    {[[-28,14,0],[0,20,-8],[30,15,-4],[-55,10,4],[55,11,4],[-14,11,-4],[20,10,2]].map(([x,h,dz],i) => (
      <mesh key={i} position={[x, h/2, dz]}>
        <coneGeometry args={[h * 1.4, h, 8]} />
        <meshStandardMaterial color={i%2===0 ? '#4a8a30' : '#5a9a38'} roughness={0.9} />
      </mesh>
    ))}
  </group>
);

// ─── SKY ───────────────────────────────────────────────────────────────────
const SkyDome = () => (
  <mesh>
    <sphereGeometry args={[210, 24, 24]} />
    <meshStandardMaterial color="#b8ddf5" side={THREE.BackSide} />
  </mesh>
);

// ─── CLOUDS ────────────────────────────────────────────────────────────────
const Cloud = ({ position, speed = 1 }) => {
  const ref = useRef();
  const sx  = position[0];
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = sx + Math.sin(clock.getElapsedTime() * 0.035 * speed) * 8;
  });
  return (
    <group ref={ref} position={position}>
      {[[-2,0,0,2.4],[0,0.9,0,2.9],[2.4,0.2,0,2.1],[4,-0.2,0,1.7]].map(([cx,cy,cz,r],i) => (
        <mesh key={i} position={[cx,cy,cz]}>
          <sphereGeometry args={[r, 8, 7]} />
          <meshStandardMaterial color="white" transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  );
};

// ─── FACTORY ───────────────────────────────────────────────────────────────
const FactoryBuilding = () => (
  <group position={[0, 0, -85]}>
    <mesh position={[0,5,0]}>
      <boxGeometry args={[22,10,24]} />
      <meshStandardMaterial color="#d0ccc4" roughness={0.6} metalness={0.1} />
    </mesh>
    {[[-6,16,-5,0.7,12],[6,14,-3,0.6,10]].map(([x,hy,z,r,ch],i)=>(
      <mesh key={i} position={[x,hy/2,z]}>
        <cylinderGeometry args={[r,r+0.1,ch,12]} />
        <meshStandardMaterial color="#999890" />
      </mesh>
    ))}
    {[[12,6,0,3],[-13,5,2,2.5]].map(([x,h,z,r],i)=>(
      <mesh key={i} position={[x,h/2,z]}>
        <cylinderGeometry args={[r,r,h,20]} />
        <meshStandardMaterial color="#e0d8cc" />
      </mesh>
    ))}
    {[[-18,5,7],[-18,5,-2]].map(([x,h,z],i)=>(
      <mesh key={i} position={[x,h/2,z]}>
        <cylinderGeometry args={[2.2,2.4,h,18]} />
        <meshStandardMaterial color="#6a7d8b" metalness={0.3} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

// ─── STEAM ─────────────────────────────────────────────────────────────────
const SteamParticle = ({ origin }) => {
  const ref = useRef();
  const sp  = useRef(0.3 + Math.random() * 0.5);
  const off = useRef(Math.random() * 3);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * sp.current + off.current) % 4;
    ref.current.position.set(origin[0] + Math.sin(t)*0.3, origin[1]+t*0.9, origin[2]);
    ref.current.material.opacity = Math.max(0, 0.4 - t/5);
    ref.current.scale.setScalar(0.15 + t*0.3);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2,6,6]} />
      <meshStandardMaterial color="white" transparent opacity={0.35} />
    </mesh>
  );
};
const Steam = ({ origin, count=4 }) => (
  <>{Array.from({length:count}).map((_,i)=><SteamParticle key={i} origin={origin}/>)}</>
);

// ─── HOTSPOT ───────────────────────────────────────────────────────────────
const HotspotLabel = ({ position, title, desc, active, onHover, onLeave, id }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1]+0.5+Math.sin(clock.getElapsedTime()*2+id)*0.12;
  });
  return (
    <group ref={ref} position={position}>
      <mesh onPointerEnter={()=>onHover(id)} onPointerLeave={onLeave}>
        <sphereGeometry args={[0.4,14,14]} />
        <meshStandardMaterial color={active?'#2ecc71':'#f39c12'} emissive={active?'#2ecc71':'#f39c12'} emissiveIntensity={0.9} />
      </mesh>
      {active && (
        <Billboard>
          <mesh position={[0,2.2,0]}>
            <planeGeometry args={[4.5,2.2]} />
            <meshStandardMaterial color="#103820" transparent opacity={0.93} />
          </mesh>
          <Text position={[0,2.7,0.01]} fontSize={0.26} color="#ffffff" anchorX="center" maxWidth={4}>{title}</Text>
          <Text position={[0,2.1,0.01]} fontSize={0.18} color="#aaffbb" anchorX="center" maxWidth={4}>{desc}</Text>
        </Billboard>
      )}
    </group>
  );
};

// ─── CAMERA ────────────────────────────────────────────────────────────────
const stages = [
  { pos: new THREE.Vector3(0,1.8,15),   look: new THREE.Vector3(0,2.5,-5)  },
  { pos: new THREE.Vector3(0,2.8,-2),   look: new THREE.Vector3(0,3,-22)   },
  { pos: new THREE.Vector3(0,5,-28),    look: new THREE.Vector3(0,4,-55)   },
  { pos: new THREE.Vector3(7,7,-58),    look: new THREE.Vector3(0,5,-80)   },
  { pos: new THREE.Vector3(22,14,-65),  look: new THREE.Vector3(0,7,-85)   },
];

const CameraDriver = ({ scrollProgress }) => {
  const { camera } = useThree();
  const tp = useRef(new THREE.Vector3());
  const tl = useRef(new THREE.Vector3());
  const lp = useRef(new THREE.Vector3(0,1.8,15));
  const ll = useRef(new THREE.Vector3(0,2.5,-5));
  useFrame(() => {
    const n = stages.length - 1;
    const raw = scrollProgress.current * n;
    const idx = Math.min(Math.floor(raw), n-1);
    const t = raw - idx;
    const a = stages[idx], b = stages[idx+1]||stages[idx];
    tp.current.lerpVectors(a.pos, b.pos, t);
    tl.current.lerpVectors(a.look, b.look, t);
    lp.current.lerp(tp.current, 0.055);
    ll.current.lerp(tl.current, 0.055);
    camera.position.copy(lp.current);
    camera.lookAt(ll.current);
  });
  return null;
};

// ─── DATA ──────────────────────────────────────────────────────────────────
const HOTSPOTS = [
  { id:0, pos:[-18,5,-79], title:'Bồn tiếp nhận mía',  desc:'Tiếp nhận và lưu trữ mía tươi từ ruộng.' },
  { id:1, pos:[-7, 4,-83], title:'Máy nghiền',          desc:'Nghiền mía trích xuất nước mía.' },
  { id:2, pos:[-18,5,-70], title:'Bồn lên men',         desc:'Lên men bằng nấm men tự nhiên.' },
  { id:3, pos:[6,  4,-83], title:'Hệ thống chưng cất', desc:'Chưng cất đạt độ tinh khiết 99.5%.' },
  { id:4, pos:[12, 7,-85], title:'Bồn chứa Ethanol',   desc:'Lưu trữ Ethanol thành phẩm.' },
];
const STAGE_INFO = [
  { title:'Giai đoạn 1', sub:'Khám phá cánh đồng mía' },
  { title:'Giai đoạn 2', sub:'Bay qua ruộng mía' },
  { title:'Giai đoạn 3', sub:'Khu tiếp nhận nguyên liệu' },
  { title:'Giai đoạn 4', sub:'Dây chuyền sản xuất Ethanol' },
  { title:'Giai đoạn 5', sub:'Toàn cảnh nhà máy Ethanol' },
];

// ─── SCENE ─────────────────────────────────────────────────────────────────
const Scene = ({ scrollProgress }) => {
  const [active, setActive] = useState(null);
  return (
    <>
      <fog attach="fog" args={['#c8eaf8', 45, 140]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[15,30,10]} intensity={1.5} color="#fff8e8" />
      <hemisphereLight args={['#c8eaf8','#7aad45',0.35]} />
      <SkyDome />
      <Cloud position={[-35,40,-60]} speed={0.8} />
      <Cloud position={[20, 45,-80]} speed={1.1} />
      <Cloud position={[-10,38,-50]} speed={0.6} />
      <Mountains />
      <Ground />
      <SugarcaneField />
      <FactoryBuilding />
      <Steam origin={[-6,22,-85]} count={5} />
      <Steam origin={[6, 20,-83]} count={4} />
      {HOTSPOTS.map(h=>(
        <HotspotLabel key={h.id} {...h} active={active===h.id} onHover={setActive} onLeave={()=>setActive(null)} />
      ))}
      <CameraDriver scrollProgress={scrollProgress} />
    </>
  );
};

// ─── PAGE ──────────────────────────────────────────────────────────────────
const FactoryTour = () => {
  const scrollProgress = useRef(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef();

  const onWheel = useCallback((e) => {
    e.preventDefault();
    scrollProgress.current = Math.min(1, Math.max(0, scrollProgress.current + e.deltaY * 0.0007));
    setStageIdx(Math.min(STAGE_INFO.length-1, Math.round(scrollProgress.current*(STAGE_INFO.length-1))));
    setShowHint(false);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive:false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden bg-[#b8ddf5] relative select-none">
      <Navbar />
      <Canvas
        shadows={false}
        camera={{ position:[0,1.8,15], fov:58 }}
        gl={{ antialias:true, powerPreference:'high-performance' }}
        dpr={[1, 1.5]}
        className="absolute inset-0"
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <div className="bg-black/35 backdrop-blur-md rounded-2xl px-8 py-3 border border-white/25">
          <p className="text-green-300 text-xs font-bold tracking-[0.2em] uppercase">{STAGE_INFO[stageIdx].title}</p>
          <p className="text-white text-lg font-semibold mt-0.5">{STAGE_INFO[stageIdx].sub}</p>
        </div>
      </div>

      {showHint && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce pointer-events-none">
          <p className="text-white/80 text-sm mb-2 font-medium">Cuộn để khám phá</p>
          <ChevronDown className="text-white/80 mx-auto" size={28} />
        </div>
      )}

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {STAGE_INFO.map((s,i) => (
          <button key={i}
            onClick={()=>{ scrollProgress.current=i/(STAGE_INFO.length-1); setStageIdx(i); setShowHint(false); }}
            className={`transition-all duration-300 rounded-full border-2 ${i===stageIdx?'w-4 h-4 bg-green-400 border-green-400':'w-2.5 h-2.5 bg-transparent border-white/60 hover:border-white'}`}
            title={s.sub}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-6 z-20">
        <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Trang chủ</a>
      </div>
    </div>
  );
};

export default FactoryTour;
