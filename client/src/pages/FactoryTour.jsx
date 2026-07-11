import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Factory3DModel from '../components/Factory3DModel';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Leaf } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const FactoryTour = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0); // 0 = Field, 1 = Factory

  return (
    <div className="min-h-screen bg-company-offWhite dark:bg-gray-950 overflow-hidden relative selection:bg-company-green/30">
      <Navbar />
      
      {/* Step 0: Sugarcane Field */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${step === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1592842062607-db560a671217?auto=format&fit=crop&w=2000&q=80")' }}
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 mt-16">
          <FadeIn direction="up" delay={200} className="flex flex-col items-center text-center max-w-3xl">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-6 border border-white/30 shadow-lg">
              <Leaf size={32} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              {t('hotspot1Title')}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 drop-shadow-md">
              {t('hotspot1Desc')}
            </p>
            
            <button 
              onClick={() => setStep(1)}
              className="group bg-company-green text-white px-8 py-4 rounded-full hover:bg-company-darkGreen transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(40,167,69,0.4)] hover:shadow-[0_8px_30px_rgba(20,50,30,0.6)] hover:scale-105 active:scale-95"
            >
              {t('enterFactory')} <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </FadeIn>
        </div>
      </div>

      {/* Step 1: 3D Factory Model */}
      <div 
        className={`absolute inset-0 pt-24 w-full h-full transition-opacity duration-1000 ease-in-out ${step === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
      >
        <Factory3DModel />
      </div>
    </div>
  );
};

export default FactoryTour;
