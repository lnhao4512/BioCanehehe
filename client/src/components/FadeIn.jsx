import React, { useEffect, useRef, useState } from 'react';

const FadeIn = ({ children, delay = 0, className = "", direction = "up", id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { rootMargin: "0px 0px -50px 0px" });
    
    if (domRef.current) observer.observe(domRef.current);
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0-init';
    if (direction === 'up') return 'animate-fade-in-up';
    if (direction === 'left') return 'animate-fade-in-left';
    if (direction === 'right') return 'animate-fade-in-right';
    return 'animate-fade-in-up';
  };

  return (
    <div
      id={id}
      ref={domRef}
      className={`${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
