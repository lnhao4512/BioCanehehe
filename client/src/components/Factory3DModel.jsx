import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Maximize, RotateCcw, Play, Pause, MousePointer2, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hotspot = React.memo(({ position, title, desc, align = 'right', dx = 40, dy = 0, portal }) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setScale(0.4);
      else if (window.innerWidth < 1280) setScale(0.6);
      else setScale(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actualDx = dx * scale;
  const actualDy = dy * scale;

  let boxClasses = '';
  if (align === 'left') {
    boxClasses = 'right-full mr-3 top-1/2 -translate-y-1/2 text-right';
  } else if (align === 'right') {
    boxClasses = 'left-full ml-3 top-1/2 -translate-y-1/2 text-left';
  } else if (align === 'top') {
    boxClasses = 'bottom-full mb-3 left-1/2 -translate-x-1/2 text-center';
  } else if (align === 'bottom') {
    boxClasses = 'top-full mt-3 left-1/2 -translate-x-1/2 text-center';
  }

  return (
    <Html position={position} center portal={portal} className="pointer-events-none z-50">
      <div className="relative">
        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-company-green rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 z-20" />
        
        {/* SVG Line */}
        <svg className="absolute overflow-visible pointer-events-none z-10" style={{ top: 0, left: 0 }}>
          <line x1="0" y1="0" x2={actualDx} y2={actualDy} stroke="rgba(40, 167, 69, 0.6)" strokeWidth="1.5" strokeDasharray="4 3" className="hotspot-line" />
          <circle cx={actualDx} cy={actualDy} r="2.5" fill="rgba(40, 167, 69, 0.8)" className="hotspot-box" />
        </svg>

        {/* Endpoint Container */}
        <div className="absolute" style={{ top: actualDy, left: actualDx }}>
          {/* Content Box */}
          <div className={`absolute w-max max-w-[120px] md:max-w-[180px] xl:max-w-[240px] bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 md:p-3 xl:p-4 border border-company-green/15 ${boxClasses} pointer-events-auto transition-transform hover:scale-105 duration-300 hotspot-box`}>
             <h4 className="font-bold text-company-darkGreen text-[10px] md:text-xs xl:text-[13px] mb-1 xl:mb-1.5">{title}</h4>
             <p className="text-company-dark/70 text-[9px] md:text-[10px] xl:text-[11px] leading-relaxed whitespace-pre-wrap">{desc}</p>
          </div>
        </div>
      </div>
    </Html>
  );
});

const FactoryGeometry = ({ showHotspots, t, containerRef }) => {
  return (
    <group position={[0, -1, 0]}>
      {/* Circular Base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 64]} />
        <meshStandardMaterial color="#e8dfd3" />
      </mesh>
      
      {/* Inner Base Platform */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[3.6, 3.6, 0.1, 64]} />
        <meshStandardMaterial color="#f5ece1" />
      </mesh>

      {/* Main Building */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[2.5, 1, 1.5]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Main Silo */}
      <mesh castShadow receiveShadow position={[1, 1.2, -1]}>
        <cylinderGeometry args={[0.6, 0.6, 2, 32]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh castShadow receiveShadow position={[1, 2.2, -1]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Tall Chimney/Tower */}
      <mesh castShadow receiveShadow position={[1.8, 1.7, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      <mesh castShadow receiveShadow position={[1.8, 3.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>

      {/* Secondary Silo */}
      <mesh castShadow receiveShadow position={[-0.8, 0.9, -1.2]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.8, 1.65, -1.2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Sugarcane field representation (green boxes) */}
      <mesh castShadow receiveShadow position={[-1.5, 0.4, 1.5]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#88b04b" />
      </mesh>
      <mesh castShadow receiveShadow position={[-2.2, 0.3, 0.8]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#7a9d45" />
      </mesh>
      
      {/* Small Pipes/Details */}
      <mesh castShadow receiveShadow position={[0.5, 0.7, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      <mesh castShadow receiveShadow position={[1, 0.7, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Hotspots */}
      {showHotspots && (
        <>
          <Hotspot position={[-1.5, 1.0, 1.5]} title={t('hotspot1Title')} desc={t('hotspot1Desc')} dx={-130} dy={0} align="left" portal={containerRef} />
          <Hotspot position={[0, 1.2, 0.7]} title={t('hotspot2Title')} desc={t('hotspot2Desc')} dx={-160} dy={0} align="left" portal={containerRef} />
          <Hotspot position={[0.8, 1.2, -0.4]} title={t('hotspot3Title')} desc={t('hotspot3Desc')} dx={160} dy={0} align="right" portal={containerRef} />
          <Hotspot position={[1, 2.5, -1]} title={t('hotspot4Title')} desc={t('hotspot4Desc')} dx={150} dy={0} align="right" portal={containerRef} />
          <Hotspot position={[1.8, 3.5, 0]} title={t('hotspot5Title')} desc={t('hotspot5Desc')} dx={130} dy={0} align="right" portal={containerRef} />
          <Hotspot position={[-0.8, 2.0, -1.2]} title={t('hotspot6Title')} desc={t('hotspot6Desc')} dx={-150} dy={0} align="left" portal={containerRef} />
        </>
      )}
    </group>
  );
};

const Factory3DModel = () => {
  const { t } = useLanguage();
  const [autoRotate, setAutoRotate] = useState(true);
  const [showHotspots, setShowHotspots] = useState(false);
  useEffect(() => {
    // Optional: Only show hotspots by default on large screens if desired
    // setShowHotspots(window.innerWidth >= 1024);
  }, []);
  const controlsRef = useRef();
  const containerRef = useRef();
  const [interactionZone, setInteractionZone] = useState(null);

  const handleReset = () => {
    if (controlsRef.current) {
      // Explicitly set the camera position back to the exact default coordinates
      controlsRef.current.object.position.set(10, 8, 10);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      setAutoRotate(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen change to adjust UI if needed
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

const ZoomHandler = ({ controlsRef }) => {
  useFrame(() => {
    if (controlsRef.current) {
      const dist = controlsRef.current.getDistance();
      const baseDist = 16.2; // Updated default distance based on [10, 8, 10]
      // Calculate how much we've zoomed in past the base distance
      const zoomFactor = Math.max(0, baseDist - dist);
      // Translate elements away
      const translateAmount = zoomFactor * 100;
      
      const leftCol = document.getElementById('left-column');
      const rightCol = document.getElementById('right-column');
      const bottomBar = document.getElementById('bottom-bar');
      
      if (window.innerWidth >= 1024) {
        if (leftCol) leftCol.style.transform = `translateX(-${translateAmount}px)`;
        if (rightCol) rightCol.style.transform = `translateX(${translateAmount}px)`;
        if (bottomBar) bottomBar.style.transform = `translate(-50%, ${zoomFactor * 30}px)`;
      } else {
        // On mobile, just fade them out slightly or do nothing to prevent layout breakage
        if (leftCol) leftCol.style.transform = 'none';
        if (rightCol) rightCol.style.transform = 'none';
        if (bottomBar) bottomBar.style.transform = 'translate(-50%, 0)';
      }
    }
  });
  return null;
};

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative group z-10 pointer-events-auto ${isFullscreen ? 'bg-[#f8f5f0]' : ''}`}
    >
      {/* Invisible Interaction Zone */}
      <div 
        ref={setInteractionZone}
        className={`absolute z-30 cursor-move ${isFullscreen ? 'inset-0 w-full h-full' : 'top-[25%] bottom-[15%] left-[10%] right-[10%] lg:left-[30%] lg:right-[30%]'}`}
      />

      <div className="w-full h-full relative">
        <Canvas 
          shadows 
          camera={{ position: [10, 8, 10], fov: 45 }}
          eventSource={interactionZone || undefined}
          className="pointer-events-none"
        >
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          <Environment preset="city" />
          <FactoryGeometry showHotspots={showHotspots} t={t} containerRef={containerRef} />
          <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={12} blur={2.5} far={4} />
          
          <OrbitControls 
            ref={controlsRef}
            domElement={interactionZone || undefined}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enablePan={true}
            enableZoom={true}
            minDistance={2}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
          />
          <ZoomHandler controlsRef={controlsRef} />
        </Canvas>
      </div>

      {/* Controls Overlay */}
      <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-40 pointer-events-auto transition-all duration-300 w-[95%] md:w-auto ${isFullscreen ? 'top-4 md:top-8' : 'bottom-36 md:bottom-40 lg:bottom-32'}`}>
        <div className="bg-white/90 backdrop-blur-sm px-3 md:px-6 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[10px] md:text-xs font-medium text-company-dark/60 flex items-center justify-center gap-1 md:gap-2 border border-black/5 w-full md:w-auto text-center">
          <MousePointer2 size={12} className="hidden md:block" />
          <span>{t('dragRotate')}</span>
          <span className="mx-0.5 md:mx-1">•</span>
          <span>{t('scrollZoom')}</span>
          <span className="mx-0.5 md:mx-1">•</span>
          <span>{t('rightPan')}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 w-full">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className="bg-white/90 backdrop-blur-sm hover:bg-gray-50 px-3 md:px-4 py-2 rounded-full shadow-sm text-[11px] md:text-xs font-medium text-company-dark flex items-center gap-1.5 md:gap-2 border border-black/5 transition-colors"
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
            {autoRotate ? t('stopRotate') : t('autoRotate')}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="bg-white/90 backdrop-blur-sm hover:bg-gray-50 px-3 md:px-4 py-2 rounded-full shadow-sm text-[11px] md:text-xs font-medium text-company-dark flex items-center gap-1.5 md:gap-2 border border-black/5 transition-colors"
          >
            <Maximize size={12} />
            {t('fullscreen')}
          </button>
          
          <button 
            onClick={handleReset}
            className="bg-white/90 backdrop-blur-sm hover:bg-gray-50 px-3 md:px-4 py-2 rounded-full shadow-sm text-[11px] md:text-xs font-medium text-company-dark flex items-center gap-1.5 md:gap-2 border border-black/5 transition-colors"
          >
            <RotateCcw size={12} />
            {t('resetView')}
          </button>

          <button 
            onClick={() => setShowHotspots(!showHotspots)}
            className={`${showHotspots ? 'bg-company-green text-white border-transparent' : 'bg-white/90 backdrop-blur-sm hover:bg-gray-50 text-company-dark border-black/5'} px-3 md:px-4 py-2 rounded-full shadow-sm text-[11px] md:text-xs font-medium flex items-center gap-1.5 md:gap-2 border transition-colors`}
          >
            <Info size={12} />
            {t('showHotspots')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Factory3DModel;
