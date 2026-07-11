import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';

// Pre-create geometry/material OUTSIDE component (stable refs, no null args issue)
const STALK_GEO  = new THREE.CylinderGeometry(0.04, 0.052, 0.5, 7);
const NODE_GEO   = new THREE.CylinderGeometry(0.058, 0.058, 0.055, 8);
const LEAF_GEO   = new THREE.PlaneGeometry(1, 0.09);
const STALK_MAT  = new THREE.MeshStandardMaterial({ roughness: 0.65, color: '#cde8a0' });
const NODE_MAT   = new THREE.MeshStandardMaterial({ roughness: 0.7, color: '#a8c870' });
const LEAF_MAT   = new THREE.MeshStandardMaterial({ roughness: 0.75, color: '#5aaf2a', side: THREE.DoubleSide });

const SEGS  = 6, LEAVES = 4, LSEGS = 2, PATH = 2.0, COUNT = 350;

const STALK_DATA = (() => {
  const arr = [];
  for (let row = 0; row < 22 && arr.length < COUNT; row++) {
    for (let col = 0; col < 16 && arr.length < COUNT; col++) {
      const side = col < 8 ? -1 : 1;
      const ci   = col < 8 ? col : col - 8;
      const x    = side * (PATH + 0.4 + ci * 0.78 + (Math.random() - 0.5) * 0.25);
      const z    = -(row * 1.15 + 3 + (Math.random() - 0.5) * 0.3);
      arr.push({ x, z, h: 3.0 + Math.random() * 1.6, phase: Math.random() * Math.PI * 2, wind: 0.018 + Math.random() * 0.014 });
    }
  }
  return arr;
})();
const TSEGS   = STALK_DATA.length * SEGS;
const TLEAVES = STALK_DATA.length * LEAVES * LSEGS;

const SugarcaneField = () => {
  const sRef = useRef(), nRef = useRef(), lRef = useRef();
  const d    = useRef(new THREE.Object3D());
  const done = useRef(false);

  useFrame(({ clock }) => {
    if (!sRef.current || !nRef.current || !lRef.current) return;
    if (!done.current) {
      const sc = new THREE.Color(), lc = new THREE.Color(), nc = new THREE.Color('#a8c870');
      const sp = ['#cde8a0','#bde090','#d2eca8','#c8e89c'], lp = ['#5aaf2a','#4a9f1a','#6abf3a','#52a522'];
      let si = 0, li = 0;
      STALK_DATA.forEach((s, i) => {
        sc.set(sp[i % sp.length]); lc.set(lp[i % lp.length]);
        for (let seg = 0; seg < SEGS; seg++) { sRef.current.setColorAt(si, sc); nRef.current.setColorAt(si, nc); si++; }
        for (let l = 0; l < LEAVES * LSEGS; l++) { lRef.current.setColorAt(li, lc); li++; }
      });
      if (sRef.current.instanceColor) sRef.current.instanceColor.needsUpdate = true;
      if (nRef.current.instanceColor) nRef.current.instanceColor.needsUpdate = true;
      if (lRef.current.instanceColor) lRef.current.instanceColor.needsUpdate = true;
      done.current = true;
    }

    const t  = clock.getElapsedTime(), H = 0.5, obj = d.current;
    let si = 0, li = 0;
    STALK_DATA.forEach(s => {
      const sw = Math.sin(t * 0.85 + s.phase) * s.wind;
      const sx = Math.cos(t * 0.65 + s.phase + 1.2) * s.wind * 0.4;
      for (let seg = 0; seg < SEGS; seg++) {
        const p = seg / SEGS, ls = sw * p * p, lx = sx * p * p;
        obj.position.set(s.x + ls * seg * 0.1, seg * H + H / 2, s.z + lx * seg * 0.08);
        obj.rotation.set(lx * 0.2, 0, ls * 0.3);
        const t2 = 1 - p * 0.28; obj.scale.set(t2, 1, t2); obj.updateMatrix();
        sRef.current.setMatrixAt(si, obj.matrix);
        nRef.current.setMatrixAt(si, obj.matrix);
        si++;
      }
      for (let leaf = 0; leaf < LEAVES; leaf++) {
        const ang = (leaf / LEAVES) * Math.PI * 2, by = s.h - leaf * 0.22 - 0.25;
        const dr = 0.5 + leaf * 0.06, ll = 1.0 + leaf * 0.08, lsw = sw * 0.6;
        obj.position.set(s.x + Math.cos(ang) * 0.1, by + 0.05, s.z + Math.sin(ang) * 0.1);
        obj.rotation.set(-dr * 0.3, ang, lsw); obj.scale.set(ll * 0.55, 1, 1); obj.updateMatrix();
        lRef.current.setMatrixAt(li, obj.matrix); li++;
        obj.position.set(s.x + Math.cos(ang) * (ll * 0.38), by - 0.22, s.z + Math.sin(ang) * (ll * 0.38));
        obj.rotation.set(-dr * 0.95, ang, lsw * 0.8); obj.scale.set(ll * 0.5, 1, 1); obj.updateMatrix();
        lRef.current.setMatrixAt(li, obj.matrix); li++;
      }
    });
    sRef.current.instanceMatrix.needsUpdate = true;
    nRef.current.instanceMatrix.needsUpdate = true;
    lRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={sRef} args={[STALK_GEO, STALK_MAT, TSEGS]} />
      <instancedMesh ref={nRef} args={[NODE_GEO,  NODE_MAT,  TSEGS]} />
      <instancedMesh ref={lRef} args={[LEAF_GEO,  LEAF_MAT,  TLEAVES]} />
    </group>
  );
};

const Ground = () => (
  <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.04,-22]}>
      <planeGeometry args={[90,110]} /><meshStandardMaterial color="#7aad45" roughness={0.95} />
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.03,-22]}>
      <planeGeometry args={[3.6,110]} /><meshStandardMaterial color="#b89a60" roughness={1} />
    </mesh>
  </group>
);

const SkyDome = () => (
  <mesh><sphereGeometry args={[210,24,24]} /><meshStandardMaterial color="#b8ddf5" side={THREE.BackSide} /></mesh>
);

const Cloud = ({ position, spd = 1 }) => {
  const ref = useRef(), ox = position[0];
  useFrame(({ clock }) => { if (ref.current) ref.current.position.x = ox + Math.sin(clock.getElapsedTime()*0.035*spd)*8; });
  return (
    <group ref={ref} position={position}>
      {[[-2,0,0,2.4],[0,0.9,0,2.9],[2.4,0.2,0,2.1],[4,-0.2,0,1.7]].map(([cx,cy,cz,r],i)=>(
        <mesh key={i} position={[cx,cy,cz]}><sphereGeometry args={[r,8,7]} /><meshStandardMaterial color="white" transparent opacity={0.88}/></mesh>
      ))}
    </group>
  );
};

const Mountains = () => (
  <group position={[0,0,-120]}>
    {[[-28,14,0],[0,20,-8],[30,15,-4],[-55,10,4],[55,11,4],[-14,11,-4],[20,10,2]].map(([x,h,dz],i)=>(
      <mesh key={i} position={[x,h/2,dz]}><coneGeometry args={[h*1.4,h,8]} /><meshStandardMaterial color={i%2===0?'#4a8a30':'#5a9a38'} roughness={0.9}/></mesh>
    ))}
  </group>
);

const Factory = () => (
  <group position={[0,0,-85]}>
    <mesh position={[0,5,0]}><boxGeometry args={[22,10,24]} /><meshStandardMaterial color="#d0ccc4" roughness={0.6} metalness={0.1}/></mesh>
    {[[-6,8,-5,0.7,12],[6,7,-3,0.6,10]].map(([x,hy,z,r,ch],i)=>(<mesh key={i} position={[x,hy,z]}><cylinderGeometry args={[r,r+0.1,ch,12]} /><meshStandardMaterial color="#999890"/></mesh>))}
    {[[12,3,0,3],[-13,2.5,2,2.5]].map(([x,h,z,r],i)=>(<mesh key={i} position={[x,h,z]}><cylinderGeometry args={[r,r,h*2,20]} /><meshStandardMaterial color="#e0d8cc"/></mesh>))}
    {[[-18,2.5,7],[-18,2.5,-2]].map(([x,h,z],i)=>(<mesh key={i} position={[x,h,z]}><cylinderGeometry args={[2.2,2.4,h*2,18]} /><meshStandardMaterial color="#6a7d8b" metalness={0.3} roughness={0.4}/></mesh>))}
  </group>
);

const SteamParticle = ({ o }) => {
  const ref=useRef(), sp=useRef(0.3+Math.random()*0.5), of=useRef(Math.random()*3);
  useFrame(({clock})=>{
    if(!ref.current)return;
    const t=(clock.getElapsedTime()*sp.current+of.current)%4;
    ref.current.position.set(o[0]+Math.sin(t)*0.3,o[1]+t*0.9,o[2]);
    ref.current.material.opacity=Math.max(0,0.4-t/5);
    ref.current.scale.setScalar(0.15+t*0.3);
  });
  return <mesh ref={ref}><sphereGeometry args={[0.2,6,6]}/><meshStandardMaterial color="white" transparent opacity={0.35}/></mesh>;
};
const Steam = ({o,n=4})=><>{Array.from({length:n}).map((_,i)=><SteamParticle key={i} o={o}/>)}</>;

const stages = [
  {pos:new THREE.Vector3(0,1.8,15),  look:new THREE.Vector3(0,2.5,-5)},
  {pos:new THREE.Vector3(0,2.8,-2),  look:new THREE.Vector3(0,3,-22)},
  {pos:new THREE.Vector3(0,5,-28),   look:new THREE.Vector3(0,4,-55)},
  {pos:new THREE.Vector3(7,7,-58),   look:new THREE.Vector3(0,5,-80)},
  {pos:new THREE.Vector3(22,14,-65), look:new THREE.Vector3(0,7,-85)},
];
const CameraDriver = ({ sp }) => {
  const { camera } = useThree();
  const tp=useRef(new THREE.Vector3()), tl=useRef(new THREE.Vector3());
  const lp=useRef(new THREE.Vector3(0,1.8,15)), ll=useRef(new THREE.Vector3(0,2.5,-5));
  useFrame(()=>{
    const n=stages.length-1, raw=sp.current*n, idx=Math.min(Math.floor(raw),n-1), t=raw-idx;
    const a=stages[idx], b=stages[Math.min(idx+1,n)];
    tp.current.lerpVectors(a.pos,b.pos,t); tl.current.lerpVectors(a.look,b.look,t);
    lp.current.lerp(tp.current,0.055); ll.current.lerp(tl.current,0.055);
    camera.position.copy(lp.current); camera.lookAt(ll.current);
  });
  return null;
};

const STAGE_INFO=[
  {title:'Giai đoạn 1',sub:'Khám phá cánh đồng mía'},
  {title:'Giai đoạn 2',sub:'Bay qua ruộng mía'},
  {title:'Giai đoạn 3',sub:'Khu tiếp nhận nguyên liệu'},
  {title:'Giai đoạn 4',sub:'Dây chuyền sản xuất Ethanol'},
  {title:'Giai đoạn 5',sub:'Toàn cảnh nhà máy Ethanol'},
];

const Scene = ({ sp }) => (
  <>
    <fog attach="fog" args={['#c8eaf8', 50, 150]} />
    <ambientLight intensity={0.8} />
    <directionalLight position={[15,30,10]} intensity={1.5} color="#fff8e8" />
    <hemisphereLight color="#c8eaf8" groundColor="#7aad45" intensity={0.35} />
    <SkyDome />
    <Cloud position={[-35,40,-60]} spd={0.8} />
    <Cloud position={[20,45,-80]}  spd={1.1} />
    <Cloud position={[-10,38,-50]} spd={0.6} />
    <Mountains />
    <Ground />
    <SugarcaneField />
    <Factory />
    <Steam o={[-6,22,-85]} n={5} />
    <Steam o={[6,20,-83]}  n={4} />
    <CameraDriver sp={sp} />
  </>
);

const FactoryTour = () => {
  const sp=useRef(0), [stageIdx,setStageIdx]=useState(0), [hint,setHint]=useState(true), ref=useRef();
  const onWheel=useCallback(e=>{
    e.preventDefault();
    sp.current=Math.min(1,Math.max(0,sp.current+e.deltaY*0.0007));
    setStageIdx(Math.min(STAGE_INFO.length-1,Math.round(sp.current*(STAGE_INFO.length-1))));
    setHint(false);
  },[]);
  useEffect(()=>{const el=ref.current;if(!el)return;el.addEventListener('wheel',onWheel,{passive:false});return()=>el.removeEventListener('wheel',onWheel);},[onWheel]);
  return (
    <div ref={ref} className="w-full h-screen overflow-hidden bg-[#b8ddf5] relative select-none">
      <Navbar />
      <Canvas shadows={false} camera={{position:[0,1.8,15],fov:58}} gl={{antialias:true,powerPreference:'high-performance'}} dpr={1} className="absolute inset-0">
        <Scene sp={sp} />
      </Canvas>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-black/35 backdrop-blur-md rounded-2xl px-8 py-3 border border-white/25 text-center">
          <p className="text-green-300 text-xs font-bold tracking-[0.2em] uppercase">{STAGE_INFO[stageIdx].title}</p>
          <p className="text-white text-lg font-semibold mt-0.5">{STAGE_INFO[stageIdx].sub}</p>
        </div>
      </div>
      {hint&&<div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce pointer-events-none"><p className="text-white/80 text-sm mb-2">Cuộn để khám phá</p><ChevronDown className="text-white/80 mx-auto" size={28}/></div>}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {STAGE_INFO.map((s,i)=>(
          <button key={i} onClick={()=>{sp.current=i/(STAGE_INFO.length-1);setStageIdx(i);setHint(false);}}
            className={`transition-all duration-300 rounded-full border-2 ${i===stageIdx?'w-4 h-4 bg-green-400 border-green-400':'w-2.5 h-2.5 bg-transparent border-white/60 hover:border-white'}`} title={s.sub}/>
        ))}
      </div>
      <div className="absolute bottom-6 left-6 z-20">
        <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Trang chủ</a>
      </div>
    </div>
  );
};
export default FactoryTour;
