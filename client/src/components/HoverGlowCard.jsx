import React, { useRef, useState } from 'react';

const HoverGlowCard = ({ children, className = '', containerClassName = '' }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 border border-company-dark/5 dark:border-white/10 ${containerClassName || 'bg-white dark:bg-gray-800'}`}
    >
      {/* Soft background glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(46, 204, 113, 0.05), transparent 40%)`, // Very subtle green background
        }}
      />
      {/* Focused bright blob spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 mix-blend-overlay"
        style={{
          opacity: opacity * 0.8,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.4), transparent 40%)`,
        }}
      />
      {/* Content wrapper */}
      <div className={`relative z-10 h-full w-full ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default HoverGlowCard;
