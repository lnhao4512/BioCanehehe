import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronDown, Menu, X, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flagUrl: 'https://flagcdn.com/w20/vn.png' },
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w20/us.png' },
  { code: 'ja', label: 'Japanese', flagUrl: 'https://flagcdn.com/w20/jp.png' },
  { code: 'ko', label: 'Korean', flagUrl: 'https://flagcdn.com/w20/kr.png' },
  { code: 'zh', label: '简体中文', flagUrl: 'https://flagcdn.com/w20/cn.png' }
];

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <>
      <nav className="fixed w-full z-[100] bg-company-offWhite/80 dark:bg-gray-950/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center top-0 shadow-sm transition-colors duration-500">
      <Link 
        to="/" 
        className="flex items-center gap-2 md:gap-3 text-company-darkGreen cursor-pointer relative z-[101]"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsMobileMenuOpen(false);
        }}
      >
        <div className="bg-company-green p-1.5 rounded-full">
          <Leaf size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-bold tracking-tight leading-none text-company-darkGreen dark:text-white transition-colors duration-500">BioCane</span>
          <span className="text-[0.5rem] md:text-[0.6rem] font-bold tracking-[0.2em] text-company-dark/50 dark:text-gray-400 mt-1 transition-colors duration-500">SUGARCANE ETHANOL</span>
        </div>
      </Link>
      
      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 items-center">
        <Link to="/factory-tour" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('factory')}</Link>
        <a href="/#products" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('products')}</a>
        <a href="/#process" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('process')}</a>
        <a href="/#team" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('team')}</a>
        <a href="/#brand" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('about')}</a>
        <a href="/#contact" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-green dark:hover:text-company-lighterGreen transition-colors font-medium">{t('contact')}</a>
      </div>
      
      {/* Right Actions (Desktop & Mobile) */}
      <div className="flex gap-4 md:gap-6 items-center z-[101]">
        {/* Theme Toggle - Visible on all screens */}
        <button 
          onClick={toggleTheme} 
          className="p-1.5 md:p-2 rounded-full hover:bg-company-dark/5 dark:hover:bg-white/10 text-company-darkGreen dark:text-company-lighterGreen transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5 md:w-[18px] md:h-[18px]" /> : <Moon className="w-5 h-5 md:w-[18px] md:h-[18px]" />}
        </button>

        {/* Language Dropdown - Visible on all screens */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 md:gap-2 text-sm font-medium text-company-dark/70 hover:text-company-green dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <img src={activeLang.flagUrl} alt={activeLang.code} className="w-5 md:w-[18px] h-auto shadow-sm" />
            <span className="hidden md:inline">{activeLang.code.toUpperCase()}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 hidden md:block ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute top-full right-0 mt-3 w-40 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-black/5 dark:border-white/10 py-2 flex flex-col z-50 overflow-hidden animate-scale-in origin-top-right">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-company-green/5 dark:hover:bg-white/5 ${language === lang.code ? 'text-company-green dark:text-company-lighterGreen font-bold bg-company-green/5 dark:bg-white/5' : 'text-company-dark/70 dark:text-gray-300'}`}
                >
                  <img src={lang.flagUrl} alt={lang.code} className="w-[18px] h-auto shadow-sm block" />
                  <span className="leading-none mt-[2px]">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Links (Login & Contact) */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/login" className="text-sm text-company-dark/70 dark:text-gray-300 hover:text-company-dark dark:hover:text-white transition-all font-medium hover:scale-105 active:scale-95">{t('login')}</Link>
          <a href="#contact" className="bg-company-green text-white text-sm px-6 py-2.5 rounded-full hover:bg-company-darkGreen dark:hover:bg-company-lightGreen transition-all duration-300 font-medium hover:scale-105 active:scale-95 hover:shadow-[0_8px_20px_rgba(40,167,69,0.25)]">{t('contactNow')}</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center text-company-darkGreen dark:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 pt-24 bg-white dark:bg-gray-950 z-[90] flex flex-col px-6 pb-6 overflow-y-auto transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-8 invisible'}`}
      >
        <div className="flex flex-col gap-6 text-lg font-medium text-company-darkGreen dark:text-white">
          <Link to="/factory-tour" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('factory')}</Link>
          <a href="/#products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('products')}</a>
          <a href="/#process" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('process')}</a>
          <a href="/#team" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('team')}</a>
          <a href="/#brand" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('about')}</a>
          <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 dark:border-gray-800 hover:text-company-green dark:hover:text-company-lighterGreen hover:pl-4 transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(46,204,113,0.4)] block">{t('contact')}</a>
          
          <div className="mt-4 flex flex-col gap-4">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-company-dark dark:text-white font-medium">{t('login')}</Link>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-company-green text-white rounded-xl font-medium">{t('contactNow')}</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
