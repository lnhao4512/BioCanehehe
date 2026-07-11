import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';

// ─── STALK DATA (computed once, pure JS, no Three.js objects) ────────────────
const STALK_DATA = (() => {
  const arr = [];
  for (let row = 0; row < 18 && arr.length < 280; row++) {
    for (let col = 0; col < 16 && arr.length < 280; col++) {
      const side = col < 8 ? -1 : 1;
      const ci   = col < 8 ? col : col - 8;
      const x    = side * (2.1 + 0.4 + ci * 0.78 + (Math.random() - 0.5) * 0.2);
      const z    = -(row * 1.15 + 3 + (Math.random() - 0.5) * 0.25);
      arr.push({ x, z, h: 3.0 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2, wind: 0.016 + Math.random() * 0.012 });
    }
  }
  return arr;
})();
const SEGS = 5, LEAVES = 3, LSEGS = 2;
const TSEGS   = STALK_DATA.length * SEGS;
const TLEAVES = STALK_DATA.length * LEAVES * LSEGS;

// ─── SUGARCANE FIELD — geometries/materials created INSIDE component ──────────
const SugarcaneField = () => {
  const sRef = useRef(), nRef = useRef(), lRef = useRef();
  const obj  = useRef(new THREE.Object3D());
  const done = useRef(false);

  // Create geometry + material INSIDE useMemo (not module level)
  const { stalkGeo, nodeGeo, leafGeo, stalkMat, nodeMat, leafMat } = useMemo(() => ({
    stalkGeo: new THREE.CylinderGeometry(0.04, 0.052, 0.5, 7),
    nodeGeo:  new THREE.CylinderGeometry(0.057, 0.057, 0.05, 8),
    leafGeo:  new THREE.PlaneGeometry(1, 0.09),
    stalkMat: new THREE.MeshStandardMaterial({ roughness: 0.65, color: '#cde8a0' }),
    nodeMat:  new THREE.MeshStandardMaterial({ roughness: 0.7,  color: '#a8c870' }),
    leafMat:  new THREE.MeshStandardMaterial({ roughness: 0.75, color: '#5aaf2a', side: THREE.DoubleSide }),
  }), []);

  // Dispose on unmount — critical to prevent context loss
  useEffect(() => () => {
    [stalkGeo, nodeGeo, leafGeo, stalkMat, nodeMat, leafMat].forEach(o => o.dispose());
  }, [stalkGeo, nodeGeo, leafGeo, stalkMat, nodeMat, leafMat]);

  useFrame(({ clock }) => {
    if (!sRef.current || !nRef.current || !lRef.current) return;

    // Color init on first valid frame
    if (!done.current) {
      const sc = new THREE.Color(), lc = new THREE.Color(), nc = new THREE.Color('#a8c870');
      const sp = ['#cde8a0','#bde090','#d2eca8','#c8e89c'];
      const lp = ['#5aaf2a','#4a9f1a','#6abf3a','#52a522'];
      let si = 0, li = 0;
      STALK_DATA.forEach((_, i) => {
        sc.set(sp[i % 4]); lc.set(lp[i % 4]);
        for (let s = 0; s < SEGS; s++) { sRef.current.setColorAt(si, sc); nRef.current.setColorAt(si, nc); si++; }
        for (let l = 0; l < LEAVES * LSEGS; l++) { lRef.current.setColorAt(li, lc); li++; }
      });
      if (sRef.current.instanceColor) sRef.current.instanceColor.needsUpdate = true;
      if (nRef.current.instanceColor)  nRef.current.instanceColor.needsUpdate = true;
      if (lRef.current.instanceColor)  lRef.current.instanceColor.needsUpdate = true;
      done.current = true;
    }

    const t = clock.getElapsedTime(), H = 0.5, d = obj.current;
    let si = 0, li = 0;

    STALK_DATA.forEach(s => {
      const sw = Math.sin(t * 0.85 + s.phase) * s.wind;
      const sx = Math.cos(t * 0.65 + s.phase + 1.2) * s.wind * 0.4;

      for (let seg = 0; seg < SEGS; seg++) {
        const p = seg / SEGS, ls = sw * p * p, lx = sx * p * p;
        d.position.set(s.x + ls * seg * 0.1, seg * H + H / 2, s.z + lx * seg * 0.07);
        d.rotation.set(lx * 0.2, 0, ls * 0.3);
        const tp = 1 - p * 0.25; d.scale.set(tp, 1, tp); d.updateMatrix();
        sRef.current.setMatrixAt(si, d.matrix);
        nRef.current.setMatrixAt(si, d.matrix);
        si++;
      }
      for (let leaf = 0; leaf < LEAVES; leaf++) {
        const ang = (leaf / LEAVES) * Math.PI * 2, by = s.h - leaf * 0.22 - 0.2;
        const dr = 0.5 + leaf * 0.07, ll2 = 0.95 + leaf * 0.08, lsw = sw * 0.55;
        d.position.set(s.x + Math.cos(ang) * 0.08, by + 0.04, s.z + Math.sin(ang) * 0.08);
        d.rotation.set(-dr * 0.3, ang, lsw); d.scale.set(ll2 * 0.52, 1, 1); d.updateMatrix();
        lRef.current.setMatrixAt(li, d.matrix); li++;
        d.position.set(s.x + Math.cos(ang) * (ll2 * 0.35), by - 0.2, s.z + Math.sin(ang) * (ll2 * 0.35));
        d.rotation.set(-dr * 0.92, ang, lsw * 0.8); d.scale.set(ll2 * 0.48, 1, 1); d.updateMatrix();
        lRef.current.setMatrixAt(li, d.matrix); li++;
      }
    });

    sRef.current.instanceMatrix.needsUpdate = true;
    nRef.current.instanceMatrix.needsUpdate = true;
    lRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={sRef} args={[stalkGeo, stalkMat, TSEGS]} />
      <instancedMesh ref={nRef} args={[nodeGeo,  nodeMat,  TSEGS]} />
      <instancedMesh ref={lRef} args={[leafGeo,  leafMat,  TLEAVES]} />
    </group>
  );
};

// ─── SIMPLE SCENE OBJECTS ────────────────────────────────────────────────────
const Ground = () => (
  <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.04,-22]}>
      <planeGeometry args={[90,110]} /><meshStandardMaterial color="#7aad45" roughness={0.95}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.03,-22]}>
      <planeGeometry args={[3.6,110]} /><meshStandardMaterial color="#b89a60" roughness={1}/>
    </mesh>
  </group>
);

const SkyDome = () => (
  <mesh>
    <sphereGeometry args={[200,20,20]}/>
    <meshStandardMaterial color="#b8ddf5" side={THREE.BackSide}/>
  </mesh>
);

const Cloud = ({ pos, spd=1 }) => {
  const ref=useRef(), ox=pos[0];
  useFrame(({clock})=>{ if(ref.current) ref.current.position.x=ox+Math.sin(clock.getElapsedTime()*0.03*spd)*8; });
  return (
    <group ref={ref} position={pos}>
      {[[-2,0,0,2.3],[0,0.8,0,2.8],[2.3,0.1,0,2],[3.8,-0.2,0,1.6]].map(([cx,cy,cz,r],i)=>(
        <mesh key={i} position={[cx,cy,cz]}><sphereGeometry args={[r,8,7]}/><meshStandardMaterial color="white" transparent opacity={0.88}/></mesh>
      ))}
    </group>
  );
};

const Mountains = () => (
  <group position={[0,0,-115]}>
    {[[-26,14,0],[0,20,-8],[28,15,-4],[-52,10,4],[52,11,4]].map(([x,h,dz],i)=>(
      <mesh key={i} position={[x,h/2,dz]}><coneGeometry args={[h*1.4,h,8]}/><meshStandardMaterial color={i%2===0?'#4a8a30':'#5a9a38'} roughness={0.9}/></mesh>
    ))}
  </group>
);

const Factory = () => (
  <group position={[0,0,-85]}>
    <mesh position={[0,5,0]}><boxGeometry args={[22,10,24]}/><meshStandardMaterial color="#d0ccc4" roughness={0.6} metalness={0.1}/></mesh>
    <mesh position={[0,10.5,0]}><boxGeometry args={[22,1,24]}/><meshStandardMaterial color="#bbb8b0"/></mesh>
    {[[-6,8,-5,0.7,12],[6,7,-3,0.6,10]].map(([x,hy,z,r,ch],i)=>(
      <mesh key={i} position={[x,hy,z]}><cylinderGeometry args={[r,r+0.1,ch,12]}/><meshStandardMaterial color="#999890"/></mesh>
    ))}
    {[[12,3,0,3],[-13,2.5,2,2.5]].map(([x,h,z,r],i)=>(
      <mesh key={i} position={[x,h,z]}><cylinderGeometry args={[r,r,h*2,20]}/><meshStandardMaterial color="#e0d8cc"/></mesh>
    ))}
    {[[-18,2.5,7],[-18,2.5,-2]].map(([x,h,z],i)=>(
      <mesh key={i} position={[x,h,z]}><cylinderGeometry args={[2.2,2.4,h*2,16]}/><meshStandardMaterial color="#6a7d8b" metalness={0.3} roughness={0.4}/></mesh>
    ))}
  </group>
);

const SteamP = ({ o }) => {
  const ref=useRef(), sp=useRef(0.3+Math.random()*0.5), of=useRef(Math.random()*3);
  useFrame(({clock})=>{
    if(!ref.current)return;
    const t=(clock.getElapsedTime()*sp.current+of.current)%4;
    ref.current.position.set(o[0]+Math.sin(t)*0.3,o[1]+t*0.9,o[2]);
    ref.current.material.opacity=Math.max(0,0.38-t/5);
    ref.current.scale.setScalar(0.15+t*0.28);
  });
  return <mesh ref={ref}><sphereGeometry args={[0.2,6,6]}/><meshStandardMaterial color="white" transparent opacity={0.35}/></mesh>;
};

// ─── CAMERA DRIVER ───────────────────────────────────────────────────────────
const STAGES = [
  {pos:[0,1.8,15],   look:[0,2.5,-5]},
  {pos:[0,2.8,-2],   look:[0,3,-22]},
  {pos:[0,5,-28],    look:[0,4,-55]},
  {pos:[7,7,-58],    look:[0,5,-80]},
  {pos:[22,14,-65],  look:[0,7,-85]},
];

const toV3 = ([x,y,z]) => new THREE.Vector3(x,y,z);

const CameraDriver = ({ sp }) => {
  const { camera } = useThree();
  const tp=useRef(new THREE.Vector3()), tl=useRef(new THREE.Vector3());
  const lp=useRef(new THREE.Vector3(0,1.8,15)), ll=useRef(new THREE.Vector3(0,2.5,-5));
  useFrame(()=>{
    const n=STAGES.length-1, raw=sp.current*n;
    const idx=Math.min(Math.floor(raw),n-1), t=raw-idx;
    const a=STAGES[idx], b=STAGES[Math.min(idx+1,n)];
    tp.current.lerpVectors(toV3(a.pos), toV3(b.pos), t);
    tl.current.lerpVectors(toV3(a.look), toV3(b.look), t);
    lp.current.lerp(tp.current, 0.055);
    ll.current.lerp(tl.current, 0.055);
    camera.position.copy(lp.current);
    camera.lookAt(ll.current);
  });
  return null;
};

// ─── SCENE ───────────────────────────────────────────────────────────────────
const Scene = ({ sp }) => (
  <>
    <fog attach="fog" args={['#c8eaf8',55,150]}/>
    <ambientLight intensity={0.8}/>
    <directionalLight position={[15,30,10]} intensity={1.4} color="#fff8e8"/>
    <hemisphereLight color="#c8eaf8" groundColor="#7aad45" intensity={0.3}/>
    <SkyDome/>
    <Cloud pos={[-35,40,-60]} spd={0.8}/>
    <Cloud pos={[20,45,-80]}  spd={1.1}/>
    <Cloud pos={[-10,38,-50]} spd={0.6}/>
    <Mountains/>
    <Ground/>
    <SugarcaneField/>
    <Factory/>
    {[0,1,2,3,4].map(i=><SteamP key={i} o={[i%2===0?-6:6, 22, i%2===0?-85:-83]}/>)}
    <CameraDriver sp={sp}/>
  </>
);

// ─── PAGE ────────────────────────────────────────────────────────────────────
const SINFO=[
  {title:'Giai đoạn 1',sub:'Khám phá cánh đồng mía'},
  {title:'Giai đoạn 2',sub:'Bay qua ruộng mía'},
  {title:'Giai đoạn 3',sub:'Khu tiếp nhận nguyên liệu'},
  {title:'Giai đoạn 4',sub:'Dây chuyền sản xuất Ethanol'},
  {title:'Giai đoạn 5',sub:'Toàn cảnh nhà máy Ethanol'},
];

const FactoryTour = () => {
  const sp=useRef(0), [idx,setIdx]=useState(0), [hint,setHint]=useState(true), ref=useRef();
  const onWheel=useCallback(e=>{
    e.preventDefault();
    sp.current=Math.min(1,Math.max(0,sp.current+e.deltaY*0.0007));
    setIdx(Math.min(SINFO.length-1,Math.round(sp.current*(SINFO.length-1))));
    setHint(false);
  },[]);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    el.addEventListener('wheel',onWheel,{passive:false});
    return()=>el.removeEventListener('wheel',onWheel);
  },[onWheel]);

  return (
    <div ref={ref} className="w-full h-screen overflow-hidden bg-[#b8ddf5] relative select-none">
      <Navbar/>
      <Canvas
        shadows={false}
        camera={{position:[0,1.8,15], fov:58}}
        gl={{antialias:true, powerPreference:'high-performance', failIfMajorPerformanceCaveat:false}}
        dpr={1}
        className="absolute inset-0"
        onCreated={({gl})=>{ gl.setClearColor('#b8ddf5'); }}
      >
        <Scene sp={sp}/>
      </Canvas>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-black/35 backdrop-blur-md rounded-2xl px-8 py-3 border border-white/25 text-center">
          <p className="text-green-300 text-xs font-bold tracking-[0.2em] uppercase">{SINFO[idx].title}</p>
          <p className="text-white text-lg font-semibold mt-0.5">{SINFO[idx].sub}</p>
        </div>
      </div>

      {hint&&(
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce pointer-events-none">
          <p className="text-white/80 text-sm mb-2">Cuộn để khám phá</p>
          <ChevronDown className="text-white/80 mx-auto" size={28}/>
        </div>
      )}

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {SINFO.map((s,i)=>(
          <button key={i} onClick={()=>{sp.current=i/(SINFO.length-1);setIdx(i);setHint(false);}}
            className={`transition-all duration-300 rounded-full border-2 ${i===idx?'w-4 h-4 bg-green-400 border-green-400':'w-2.5 h-2.5 bg-transparent border-white/60 hover:border-white'}`}
            title={s.sub}/>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 z-20">
        <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Trang chủ</a>
      </div>
    </div>
  );
};

export default FactoryTour;
