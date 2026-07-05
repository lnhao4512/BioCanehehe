import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flagUrl: 'https://flagcdn.com/w20/vn.png' },
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w20/us.png' },
  { code: 'ja', label: 'Japanese', flagUrl: 'https://flagcdn.com/w20/jp.png' },
  { code: 'ko', label: 'Korean', flagUrl: 'https://flagcdn.com/w20/kr.png' },
  { code: 'zh', label: '简体中文', flagUrl: 'https://flagcdn.com/w20/cn.png' }
];

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = languages.find(l => l.code === language) || languages[0];

  return (
    <nav className="fixed w-full z-50 bg-company-offWhite/80 backdrop-blur-md py-4 px-12 flex justify-between items-center top-0">
      <Link 
        to="/" 
        className="flex items-center gap-3 text-company-darkGreen cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="bg-company-green p-1.5 rounded-full">
          <Leaf size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight leading-none text-company-darkGreen">BioCane</span>
          <span className="text-[0.6rem] font-bold tracking-[0.2em] text-company-dark/50 mt-1">SUGARCANE ETHANOL</span>
        </div>
      </Link>
      
      <div className="flex gap-8 items-center">
        <a href="/#products" className="text-sm text-company-dark/70 hover:text-company-green transition-colors font-medium">{t('products')}</a>
        <a href="/#process" className="text-sm text-company-dark/70 hover:text-company-green transition-colors font-medium">{t('process')}</a>
        <a href="/#team" className="text-sm text-company-dark/70 hover:text-company-green transition-colors font-medium">{t('team')}</a>
        <a href="/#brand" className="text-sm text-company-dark/70 hover:text-company-green transition-colors font-medium">{t('about')}</a>
        <a href="/#contact" className="text-sm text-company-dark/70 hover:text-company-green transition-colors font-medium">{t('contact')}</a>
      </div>
      
      <div className="flex gap-6 items-center">
        {/* Custom Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 text-sm font-medium text-company-dark/70 hover:text-company-green transition-colors"
          >
            <img src={activeLang.flagUrl} alt={activeLang.code} className="w-[18px] h-auto shadow-sm" />
            <span>{activeLang.code.toUpperCase()}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute top-full right-0 mt-3 w-40 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-black/5 py-2 flex flex-col z-50 overflow-hidden animate-scale-in origin-top-right">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-company-green/5 ${language === lang.code ? 'text-company-green font-bold bg-company-green/5' : 'text-company-dark/70'}`}
                >
                  <img src={lang.flagUrl} alt={lang.code} className="w-[18px] h-auto shadow-sm block" />
                  <span className="leading-none mt-[2px]">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/login" className="text-sm text-company-dark/70 hover:text-company-dark transition-all font-medium hover:scale-105 active:scale-95">{t('login')}</Link>
        <a href="#contact" className="bg-company-green text-white text-sm px-6 py-2.5 rounded-full hover:bg-company-darkGreen transition-all duration-300 font-medium hover:scale-105 active:scale-95 hover:shadow-[0_8px_20px_rgba(40,167,69,0.25)]">{t('contactNow')}</a>
      </div>
    </nav>
  );
};

export default Navbar;
