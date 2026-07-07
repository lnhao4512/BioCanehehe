import React from 'react';
import Navbar from '../components/Navbar';
import Factory3DModel from '../components/Factory3DModel';
import { Leaf, Zap, TrendingDown, Award, ArrowRight, Phone, Mail, MapPin, RefreshCw, Shield, Droplet, CheckCircle2, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FadeIn from '../components/FadeIn';
import HoverGlowCard from '../components/HoverGlowCard';
const Home = () => {
  const { t } = useLanguage();
  const [teamMembers, setTeamMembers] = React.useState([]);

  React.useEffect(() => {
    // Fetch team members
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setTeamMembers(data);
        } else {
          // Fallback static data if db is empty
          setTeamMembers([
            { name: 'Nguyễn Thời Trung', role: 'Trưởng lab Tính toán và mô hình hóa Hóa học – Viện Khoa học tính toán & Trí tuệ nhân tạo', description: 'Phó Giáo sư, Tiến sĩ', email: 'trung.nguyenthoi@vlu.edu.vn', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
            { name: 'Trần Thị Mai Linh', role: 'CTO – Công nghệ Sinh học', description: 'Chuyên gia hàng đầu về công nghệ lên men và chưng cất ethanol. Hơn 20 bài báo khoa học quốc tế.', email: 'mailinh@biocane.vn', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' }
          ]);
        }
      })
      .catch(err => console.error('Error fetching team:', err));
  }, []);

  return (
    <div className="min-h-screen bg-company-offWhite dark:bg-gray-950 overflow-x-hidden transition-colors duration-500">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6 lg:px-12 xl:px-16 min-h-screen flex flex-col justify-center bg-[#f8f5f0] dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-500">
        
        <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-12 gap-8 lg:gap-10 2xl:gap-12 items-center relative z-10 pointer-events-none">
          
          {/* Left Column - Text */}
          <FadeIn direction="left" delay={200} className="lg:col-span-1 2xl:col-span-3 flex flex-col z-10 pt-8 pointer-events-auto transition-transform duration-100 ease-out will-change-transform min-w-0">
            <div id="left-column" className="min-w-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-company-green/40 shrink-0"></div>
              <span className="text-sm font-bold tracking-[0.2em] text-company-green dark:text-company-lighterGreen uppercase break-words">NĂNG LƯỢNG XANH TỪ THIÊN NHIÊN</span>
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-5xl 2xl:text-[60px] font-serif font-bold text-company-darkGreen dark:text-white mb-6 md:mb-8 break-words"
              style={{ lineHeight: '1.35', wordBreak: 'break-word' }}
            >
              {t('heroTitle1')}<br />{t('heroTitle2')}<br />{t('heroTitle3')}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-company-dark/70 dark:text-gray-300 mb-8 md:mb-10 leading-relaxed break-words">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap sm:flex-row gap-4 mt-2">
              <a href="#products" className="group bg-company-darkGreen text-white px-6 py-3.5 md:px-8 md:py-4 rounded-full hover:bg-company-green transition-all duration-300 text-sm md:text-base font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-[0_8px_25px_rgba(20,50,30,0.3)] hover:scale-105 active:scale-95 flex-1 sm:flex-none text-center min-w-[max-content]">
                {t('exploreProducts')} <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
              </a>
              <a href="#brand" className="bg-white dark:bg-gray-800 text-company-dark dark:text-white px-6 py-3.5 md:px-8 md:py-4 rounded-full border border-company-dark/10 dark:border-gray-700 hover:border-company-dark/30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm md:text-base font-medium text-center shadow-sm hover:scale-105 active:scale-95 flex-1 sm:flex-none min-w-[max-content]">
                {t('downloadProfile')}
              </a>
            </div>
          </div>
          </FadeIn>
          
          {/* Center Column - 3D Model */}
          <div className="h-[450px] md:h-[600px] 2xl:h-[700px] w-full lg:col-span-1 2xl:col-span-6 pointer-events-auto relative z-20 min-w-0">
            <Factory3DModel />
          </div>

          {/* Right Column - Cards */}
          <FadeIn direction="right" className="lg:col-span-2 2xl:col-span-3 flex flex-col z-10 mt-10 md:mt-16 2xl:mt-0 pointer-events-auto transition-transform duration-100 ease-out will-change-transform min-w-0" delay={400}>
            <div id="right-column" className="flex lg:flex-row 2xl:flex-col gap-6 w-full max-w-full overflow-hidden">
              {/* Card 1 */}
            <div className="bg-company-darkGreen rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-lg h-auto min-h-[160px] 2xl:h-48 flex flex-col justify-between flex-1 shrink-0">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
              <Leaf className="text-company-lighterGreen mb-4 lg:mb-0" size={32} />
              <div>
                <h3 className="text-3xl md:text-4xl 2xl:text-5xl font-bold font-serif mb-1 md:mb-2 break-words">75M</h3>
                <p className="text-white/70 text-xs md:text-sm font-medium">{t('litersPerYear')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:gap-6 flex-[2] shrink-0">
              {/* Card 2 */}
              <div className="bg-company-lighterGreen rounded-[2rem] p-5 lg:p-6 text-white shadow-md h-auto min-h-[140px] 2xl:h-40 flex flex-col justify-between">
                <Zap className="text-white/90 mb-3 lg:mb-0" size={24} />
                <div>
                  <h3 className="text-xl md:text-2xl 2xl:text-3xl font-bold font-serif mb-1 break-words">99.5%</h3>
                  <p className="text-white/90 text-[10px] md:text-xs lg:text-sm font-medium">{t('purity')}</p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-[#e77a63] rounded-[2rem] p-5 lg:p-6 text-white shadow-md h-auto min-h-[140px] 2xl:h-40 flex flex-col justify-between">
                <TrendingDown className="text-white/90 mb-3 lg:mb-0" size={24} />
                <div>
                  <h3 className="text-xl md:text-2xl 2xl:text-3xl font-bold font-serif mb-1 break-words">-40%</h3>
                  <p className="text-white/90 text-[10px] md:text-xs lg:text-sm font-medium">{t('co2Reduction')}</p>
                </div>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-[#fdf8e7] dark:bg-gray-800 rounded-[2rem] p-5 lg:p-6 text-company-darkGreen dark:text-white flex items-start gap-4 lg:gap-5 shadow-sm border border-[#f0eadd] dark:border-gray-700 transition-colors duration-500 flex-[1.5] shrink-0 h-auto">
              <Award className="text-company-green dark:text-company-lighterGreen flex-shrink-0 mt-1" size={24} />
              <div className="min-w-0">
                <h3 className="font-bold text-sm lg:text-base mb-1 truncate">{t('certTitle')}</h3>
                <p className="text-company-darkGreen/60 dark:text-gray-400 text-xs lg:text-sm leading-relaxed transition-colors duration-500 break-words line-clamp-3">{t('certDesc')}</p>
              </div>
            </div>
            </div>
          </FadeIn>
        </div>

        {/* Feature Bar (Bottom) */}
        <FadeIn direction="up" delay={600} className="relative mt-24 xl:mt-32 mx-auto w-[95%] xl:w-[90%] max-w-[1200px] z-20 pointer-events-auto pb-12">
          <div id="bottom-bar" className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-[2rem] xl:rounded-full border border-white dark:border-gray-800 shadow-sm flex flex-wrap justify-between items-center px-6 xl:px-8 py-4 gap-y-4 gap-x-2 transition-all duration-500 ease-out will-change-transform hover:shadow-md hover:bg-white/95 dark:hover:bg-gray-900/95">
            <div className="flex items-center gap-3 w-[48%] xl:w-auto">
            <Leaf className="text-company-darkGreen dark:text-company-lighterGreen shrink-0" size={20} />
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-company-darkGreen dark:text-white leading-tight">{t('feat1Title')}</h4>
              <p className="text-[#a0a8a3] dark:text-gray-400 text-[9px] lg:text-[10px] mt-0.5">{t('feat1Desc')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-[48%] xl:w-auto">
            <RefreshCw className="text-company-darkGreen dark:text-company-lighterGreen shrink-0" size={20} />
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-company-darkGreen dark:text-white leading-tight">{t('feat2Title')}</h4>
              <p className="text-[#a0a8a3] dark:text-gray-400 text-[9px] lg:text-[10px] mt-0.5">{t('feat2Desc')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-[48%] xl:w-auto">
            <Shield className="text-company-darkGreen dark:text-company-lighterGreen shrink-0" size={20} />
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-company-darkGreen dark:text-white leading-tight">{t('feat3Title')}</h4>
              <p className="text-[#a0a8a3] dark:text-gray-400 text-[9px] lg:text-[10px] mt-0.5">{t('feat3Desc')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-[48%] xl:w-auto">
            <Droplet className="text-company-darkGreen dark:text-company-lighterGreen shrink-0" size={20} />
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-company-darkGreen dark:text-white leading-tight">{t('feat4Title')}</h4>
              <p className="text-[#a0a8a3] dark:text-gray-400 text-[9px] lg:text-[10px] mt-0.5">{t('feat4Desc')}</p>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-12 bg-company-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xl font-bold tracking-[0.2em] text-company-orange uppercase block mb-4">{t('processSubtitle')}</span>
            <h2 className="text-5xl font-serif font-bold text-company-darkGreen">{t('processTitle1')}<br/>{t('processTitle2')}</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-6 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-company-dark/10 -z-10 hidden md:block"></div>
            
            {[
              { num: '01', title: t('process1Title'), desc: t('process1Desc'), icon: <Leaf size={20} className="text-company-darkGreen" /> },
              { num: '02', title: t('process2Title'), desc: t('process2Desc'), icon: <Zap size={20} className="text-company-green" /> },
              { num: '03', title: t('process3Title'), desc: t('process3Desc'), icon: <TrendingDown size={20} className="text-company-lighterGreen" /> },
              { num: '04', title: t('process4Title'), desc: t('process4Desc'), icon: <TrendingDown size={20} className="text-company-orange" /> }
            ].map((step, idx) => (
              <HoverGlowCard key={idx} containerClassName="rounded-3xl shadow-sm bg-white" className="p-8 group">
                <div className="text-7xl font-serif font-bold text-company-dark/5 absolute -right-2 top-4 group-hover:text-company-green/5 transition-colors">{step.num}</div>
                <div className="w-12 h-12 bg-company-cream rounded-full flex items-center justify-center mb-16 relative z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold font-serif mb-4 text-company-darkGreen relative z-10">{step.title}</h3>
                <p className="text-company-dark/60 text-sm leading-relaxed relative z-10">{step.desc}</p>
              </HoverGlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 px-12 bg-company-offWhite">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xl font-bold tracking-[0.2em] text-company-green uppercase block mb-4">{t('prodSubtitle')}</span>
              <h2 className="text-5xl font-serif font-bold text-company-darkGreen">{t('prodTitle1')}<br/>{t('prodTitle2')}</h2>
            </div>
            <div className="flex gap-2 p-1 bg-white rounded-full border border-company-dark/10">
              <button className="px-6 py-2 rounded-full bg-company-darkGreen text-white text-sm font-medium">{t('prodCat1')}</button>
              <button className="px-6 py-2 rounded-full text-company-dark/60 hover:text-company-dark text-sm font-medium">{t('prodCat2')}</button>
              <button className="px-6 py-2 rounded-full text-company-dark/60 hover:text-company-dark text-sm font-medium">{t('prodCat3')}</button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-company-cream/50 rounded-[2rem] overflow-hidden flex flex-col h-full border border-company-dark/5">
              <div className="bg-company-darkGreen p-8 text-white relative min-h-[200px] flex flex-col justify-end">
                <span className="absolute top-6 right-6 bg-white text-company-darkGreen text-xs font-bold px-3 py-1 rounded-full">{t('bestSeller')}</span>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">99.5% PURE</p>
              </div>
              <div className="p-8">
                <span className="text-xs font-bold tracking-[0.2em] text-company-dark/40 uppercase block mb-2">{t('prodCat1')}</span>
                <h3 className="text-2xl font-serif font-bold text-company-darkGreen mb-4">Fuel Ethanol E10</h3>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-company-cream/50 rounded-[2rem] overflow-hidden flex flex-col h-full border border-company-dark/5">
              <div className="bg-company-green p-8 text-white relative min-h-[200px] flex flex-col justify-end">
                <span className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{t('premium')}</span>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">99.8% PURE</p>
              </div>
              <div className="p-8">
                <span className="text-xs font-bold tracking-[0.2em] text-company-dark/40 uppercase block mb-2">{t('prodCat2')}</span>
                <h3 className="text-2xl font-serif font-bold text-company-darkGreen mb-4">Pharma-Grade Ethanol</h3>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-company-cream/50 rounded-[2rem] overflow-hidden flex flex-col h-full border border-company-dark/5">
              <div className="bg-company-lighterGreen p-8 text-white relative min-h-[200px] flex flex-col justify-end">
                <span className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{t('natural')}</span>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">96.0% PURE</p>
              </div>
              <div className="p-8">
                <span className="text-xs font-bold tracking-[0.2em] text-company-dark/40 uppercase block mb-2">{t('prodCat3')}</span>
                <h3 className="text-2xl font-serif font-bold text-company-darkGreen mb-4">Food-Grade Ethanol</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-12 bg-company-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xl font-bold tracking-[0.2em] text-company-orange uppercase block mb-4">{t('teamSubtitle')}</span>
            <h2 className="text-5xl font-serif font-bold text-company-darkGreen mb-6">{t('teamTitle1')}<br/>{t('teamTitle2')}</h2>
            <p className="text-lg text-company-dark/60 max-w-2xl mx-auto">{t('teamDesc')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {teamMembers.map((member, index) => (
              <HoverGlowCard key={index} containerClassName="rounded-3xl shadow-sm bg-white" className="flex flex-col p-5 xl:p-6 group">
                {/* Image */}
                <div className="w-full mb-5 overflow-hidden rounded-2xl">
                  <img 
                    src={member.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"} 
                    alt={member.name} 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl xl:text-2xl font-bold text-company-dark mb-1.5">{member.name}</h3>
                  <p className="font-medium text-xs xl:text-sm mb-5 leading-relaxed text-[#d62828]">{member.role}</p>
                  
                  {member.email && (
                    <div className="flex items-center gap-2 xl:gap-3 text-company-dark/80 font-medium mt-auto pt-4 border-t border-black/5">
                      <Mail size={16} className="text-[#d62828] flex-shrink-0" />
                      <a href={`mailto:${member.email}`} className="transition-colors text-xs xl:text-sm hover:text-[#d62828] truncate">{member.email}</a>
                    </div>
                  )}
                </div>
              </HoverGlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="brand" className="py-24 px-6 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <FadeIn direction="left" delay={200}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80" 
                  alt="Green nature" 
                  className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-10 -right-10 bg-company-darkGreen text-white p-8 rounded-3xl shadow-xl w-64 hidden md:block">
                  <Leaf size={32} className="text-company-lighterGreen mb-4" />
                  <h4 className="text-2xl font-serif font-bold mb-2">{t('aboutYearTitle')}</h4>
                  <p className="text-white/70 text-sm">{t('aboutYearDesc')}</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="right" delay={400} className="flex flex-col justify-center">
              <span className="text-xl font-bold tracking-[0.2em] text-company-orange uppercase block mb-4">{t('aboutSubtitle')}</span>
              <h2 className="text-4xl font-serif font-bold text-company-darkGreen mb-6">{t('aboutTitle1')}<br/>{t('aboutTitle2')}</h2>
              <p className="text-company-dark/70 leading-relaxed mb-8 text-lg">
                {t('aboutDesc')}
              </p>
              
              <ul className="space-y-6">
                {[
                  t('aboutFeat1'),
                  t('aboutFeat2'),
                  t('aboutFeat3'),
                  t('aboutFeat4')
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckCircle2 className="text-company-green flex-shrink-0 mt-1" size={20} />
                    <span className="text-company-dark font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Core Values */}
          <div>
            <FadeIn direction="up" className="text-center mb-16">
              <span className="text-xl font-bold tracking-[0.2em] text-company-orange uppercase block mb-4">{t('coreValuesSubtitle')}</span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-company-darkGreen">{t('coreValuesTitle')}</h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn direction="up" delay={200} className="h-full">
                <HoverGlowCard containerClassName="rounded-[2rem] shadow-sm bg-company-cream/30" className="p-10">
                  <div className="bg-company-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Globe className="text-company-green" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-company-darkGreen mb-4">{t('coreValue1Title')}</h3>
                  <p className="text-company-dark/60 leading-relaxed">{t('coreValue1Desc')}</p>
                </HoverGlowCard>
              </FadeIn>
              
              <FadeIn direction="up" delay={400} className="h-full">
                <HoverGlowCard containerClassName="rounded-[2rem] shadow-sm bg-company-cream/30" className="p-10">
                  <div className="bg-company-orange/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="text-company-orange" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-company-darkGreen mb-4">{t('coreValue2Title')}</h3>
                  <p className="text-company-dark/60 leading-relaxed">{t('coreValue2Desc')}</p>
                </HoverGlowCard>
              </FadeIn>

              <FadeIn direction="up" delay={600} className="h-full">
                <HoverGlowCard containerClassName="rounded-[2rem] shadow-sm bg-company-cream/30" className="p-10">
                  <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Droplet className="text-blue-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-company-darkGreen mb-4">{t('coreValue3Title')}</h3>
                  <p className="text-company-dark/60 leading-relaxed">{t('coreValue3Desc')}</p>
                </HoverGlowCard>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA & Footer */}
      <footer id="contact" className="bg-company-offWhite pt-12 border-t border-company-dark/5">
        <div className="max-w-7xl mx-auto px-12 pb-16">
          {/* CTA Box */}
          <div className="bg-gradient-to-br from-[#2a3c33] to-[#16271f] rounded-[3rem] p-20 text-center mb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-company-lighterGreen/50"></div>
                <span className="text-xl font-bold tracking-[0.2em] text-company-lighterGreen uppercase">{t('ctaSubtitle')}</span>
                <div className="h-[1px] w-12 bg-company-lighterGreen/50"></div>
              </div>
              <h2 className="text-5xl font-serif font-bold text-white mb-6">{t('ctaTitle1')}<br/>{t('ctaTitle2')}</h2>
              <p className="text-white/60 mb-10">{t('ctaDesc')}</p>
              
              <div className="flex justify-center gap-4">
                <button className="bg-company-lighterGreen text-white px-8 py-3.5 rounded-full font-medium hover:bg-company-green transition-colors">
                  {t('becomePartner')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Content */}
          <div className="grid grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-3 text-company-darkGreen mb-6">
                <div className="bg-company-green p-1.5 rounded-full">
                  <Leaf size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight leading-none text-company-darkGreen">BioCane</span>
                </div>
              </div>
              <p className="text-sm text-company-dark/60 leading-relaxed mb-6">
                {t('footerDesc')}
              </p>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full border border-company-dark/10 flex items-center justify-center text-company-dark/60 hover:text-company-green transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-company-dark/10 flex items-center justify-center text-company-dark/60 hover:text-company-green transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-company-dark/10 flex items-center justify-center text-company-dark/60 hover:text-company-green transition-colors cursor-pointer">
                  <span className="text-xs">tw</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-company-darkGreen mb-6">{t('footerProd')}</h4>
              <ul className="space-y-4 text-sm text-company-dark/60">
                <li><a href="#" className="hover:text-company-green transition-colors">Fuel Ethanol E10</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">Pharma-Grade</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">Food-Grade</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('footerBio')}</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('footerCatalog')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-company-darkGreen mb-6">{t('footerCompany')}</h4>
              <ul className="space-y-4 text-sm text-company-dark/60">
                <li><a href="#" className="hover:text-company-green transition-colors">{t('footerAbout')}</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('processSubtitle')}</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('teamSubtitle')}</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('footerNews')}</a></li>
                <li><a href="#" className="hover:text-company-green transition-colors">{t('footerJobs')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-company-darkGreen mb-6">{t('footerContact')}</h4>
              <ul className="space-y-4 text-sm text-company-dark/60">
                <li className="flex items-center gap-3"><Phone size={16} className="text-company-green" /> 1800 2468 135</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-company-green" /> info@biocane.vn</li>
                <li className="flex items-start gap-3"><MapPin size={16} className="text-company-green mt-1" /> <span>{t('footerAddress')}</span></li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-2 h-1 mb-8">
            <div className="bg-company-darkGreen w-1/4 rounded-full"></div>
            <div className="bg-company-green w-1/4 rounded-full"></div>
            <div className="bg-company-lighterGreen w-1/4 rounded-full"></div>
            <div className="bg-company-orange w-1/8 rounded-full flex-grow"></div>
            <div className="bg-[#d62828] w-1/8 rounded-full flex-grow"></div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-company-dark/40 pt-4">
            <p>{t('footerRights')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-company-dark transition-colors">{t('footerPrivacy')}</a>
              <a href="#" className="hover:text-company-dark transition-colors">{t('footerTerms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
