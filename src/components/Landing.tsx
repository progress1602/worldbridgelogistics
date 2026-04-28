import React, { useState, useEffect } from 'react';
import { 
  Search, Package, MapPin, Shield, ListTodo, Truck, ArrowRight, 
  LayoutDashboard, Globe, ShieldCheck, Headphones, Database, 
  Star, Zap, Anchor, Plane, Building2, Timer, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';

// Counter component for animated statistics
const Counter: React.FC<{ value: string }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix (e.g., "45.2K" -> { num: 45.2, suffix: "K" })
  const match = value.match(/([\d.]+)([KM%+]*)/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const decimals = match?.[1].includes('.') ? match[1].split('.')[1].length : 0;

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (outQuart)
        const ease = 1 - Math.pow(1 - progress, 4);
        
        const nextValue = ease * target;
        setCount(nextValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}
      {suffix}
    </span>
  );
};

interface HeroProps {
  onSearch: (id: string) => void;
  onHistoryClick: () => void;
  isSearching: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onHistoryClick, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section id="tracking" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/50 -skew-x-[20deg] origin-top translate-x-1/4 -z-0" />
      <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-8 border border-primary/10">
              <Zap className="w-3 h-3 fill-primary" />
                Global Logistics Reimagined
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black text-navy tracking-tight mb-6 md:mb-8 leading-[0.95]">
              Logistics at the <br />
              <span className="text-primary italic relative">
                Speed of Light
                <svg className="absolute -bottom-2 left-0 w-full h-2 md:h-3 text-primary/20 -z-10" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 15C50 5 150 5 199 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-12 max-w-lg leading-relaxed font-medium">
              Enterprise-grade cargo solutions that bridge the gap between continents. We move the world so you can grow your business without boundaries.
            </p>

            {/* Mobile-only Brand Visual - Accurate WorldBridge Team Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block md:hidden mb-10 w-full"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(255,107,0,0.3)] border-2 border-white ring-1 ring-gray-100 group">
                <img 
                  src="/public/hero.jpg" 
                  alt="WorldBridge Logistics Specialist" 
                  className="w-full h-auto object-cover aspect-[4/3] scale-105 group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                
              </div>
            </motion.div>
            
            <div className="bg-white p-2 shadow-2xl rounded-2xl border border-gray-100 flex items-center gap-2 max-w-xl group focus-within:ring-4 ring-primary/5 transition-all">
               <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Tracking Identifier..."
                    className="w-full bg-transparent px-16 py-6 border-none outline-none font-bold text-navy placeholder:text-gray-300"
                  />
               </div>
               <button 
                  onClick={handleSubmit}
                  disabled={isSearching}
                  className="bg-primary hover:bg-navy text-white px-10 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 disabled:bg-gray-400 shrink-0"
                >
                  {isSearching ? 'Hashing...' : 'Track'}
                </button>
            </div>

            <div className="mt-8">
               <button 
                 onClick={onHistoryClick}
                 className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/30 transition-all italic"
               >
                 <Timer className="w-4 h-4" /> View Search History
               </button>
            </div>

            <div className="mt-12 flex items-center gap-8 grayscale opacity-50 group-hover:grayscale-0 transition-all">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                     </div>
                   ))}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Trusted by <span className="text-navy font-black">2.5k+</span> global partners
                </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
             <div className="aspect-square relative flex items-center justify-center">
                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 left-0 bg-white p-6 shadow-2xl rounded-3xl border border-gray-50 flex items-center gap-4 z-20"
                >
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                     <Package className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-xl font-display font-black text-navy tracking-tight">1.2M+</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Packages Moved</div>
                   </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 right-0 bg-navy p-6 shadow-2xl rounded-3xl flex items-center gap-4 z-20"
                >
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                     <Globe className="w-6 h-6" />
                   </div>
                   <div className="text-white">
                     <div className="text-xl font-display font-black tracking-tight">210+</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Countries Connected</div>
                   </div>
                </motion.div>

                {/* Main Hero Image */}
                <div className="w-full h-full p-10 relative">
                   <div className="absolute inset-0 border-[20px] border-accent rounded-full scale-90" />
                   <img 
                     src="https://picsum.photos/seed/delivery/1000/1000" 
                     alt="Cargo" 
                     className="w-full h-full object-cover rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10"
                     referrerPolicy="no-referrer"
                   />
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const solutions = [
    { 
      title: 'Air Precision', 
      icon: Plane, 
      desc: 'Next-day delivery for mission critical assets across all major global hubs.',
      size: 'large',
      image: 'https://picsum.photos/seed/plane/800/400'
    },
    { 
      title: 'Ocean Might', 
      icon: Anchor, 
      desc: 'Sustainable large-scale transit for bulk logistics.',
      size: 'small'
    },
    { 
      title: 'Road Network', 
      icon: Truck, 
      desc: 'Seamless last-mile routes through our proprietary fleet.',
      size: 'small'
    },
    { 
      title: 'Smart Warehousing', 
      icon: Building2, 
      desc: 'AI-driven storage solutions for optimal stock rotation and rapid deployment.',
      size: 'medium'
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-20">
          <div className="text-center md:text-left">
            <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Elite Solutions</div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-navy uppercase tracking-tighter leading-none">
              Infrastructural <br />
              <span className="text-primary italic">Power.</span>
            </h2>
          </div>
          <p className="max-w-md text-gray-400 font-medium leading-relaxed text-center md:text-left">
            We don't just move boxes; we orchestrate complex supply chains with precision engineering and real-time intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
          {solutions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-8 md:p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'medium' ? 'md:col-span-2' : ''}
              `}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8 overflow-hidden">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-black text-navy mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed mb-6 group-hover:text-navy transition-colors">{item.desc}</p>
                <div className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  Explore Hub <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {item.image && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                  <img src={item.image} alt="" className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const testimonials = [
    {
      name: "ALEXANDER R. CROSS",
      role: "Director of Global Operations, NEXUS CORP",
      text: "This system transformed our distribution hash 100%. The speed and node reliability is simply unmatched in the industry.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    },
    {
      name: "SARAH JENNINGS",
      role: "Logistics Lead, VERTEX SOLUTIONS",
      text: "Managing over 500+ monthly consignments was a nightmare until we integrated with WorldBridge. Best decision for our scale.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    },
    {
      name: "MARCUS CHENG",
      role: "E-Commerce Founder, KINETIC",
      text: "The real-time tracking transparency is what keeps our customers coming back. It's not just delivery; it's trust as a service.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    },
    {
      name: "ELENA RODRIGUEZ",
      role: "Supply Chain Manager, ECOVIBE",
      text: "Their ocean freight solutions helped us cut carbon emissions while maintaining precise delivery windows. Highly intelligent infrastructure.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    },
    {
      name: "DAVID BLAKE",
      role: "Head of Infrastructure, TITAN IND.",
      text: "Real-time node updates and the high-tech dashboard make managing complex routes effortless. WorldBridge is the future.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    },
    {
      name: "SOPHIE VAN DER BERG",
      role: "CEO, NORDIC LOGISTICS",
      text: "The precision and technical depth of their distribution net is staggering. It has enabled our rapid expansion into the EMEA region.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      stars: 5
    }
  ];

  const itemsPerSlide = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const slides = [];
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    slides.push(testimonials.slice(i, i + itemsPerSlide));
  }

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-accent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-12 md:mb-20">
            <div className="text-center md:text-left">
               <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Market Feedback</div>
               <h2 className="text-4xl md:text-6xl font-display font-black text-navy uppercase tracking-tighter leading-none italic">
                 Consensus of <br />
                 <span className="text-primary not-italic">Excellence.</span>
               </h2>
            </div>
            {/* Dots */}
            <div className="flex gap-3">
               {slides.map((_, i) => (
                 <button 
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${activeIndex === i ? 'w-12 bg-primary' : 'w-4 bg-gray-200'}`}
                 />
               ))}
            </div>
         </div>

         <div className="relative overflow-hidden">
            <motion.div 
               animate={{ x: `-${activeIndex * 100}%` }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="flex cursor-grab active:cursor-grabbing"
            >
               {slides.map((slide, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2 md:px-4">
                     {slide.map((item, subIdx) => (
                        <div key={subIdx} className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-50 flex flex-col justify-between h-full group hover:shadow-primary/5 transition-all duration-500 relative">
                           <div className="absolute top-10 right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                             <Star className="w-24 md:w-32 h-24 md:h-32 fill-primary" />
                           </div>
                           
                           <div className="relative z-10">
                              <div className="flex gap-1 mb-6 md:mb-8">
                                {[...Array(item.stars)].map((_, i) => <Star key={i} className="w-3 md:w-4 h-3 md:h-4 text-primary fill-primary" />)}
                              </div>
                  <h3 className="text-lg md:text-2xl font-display font-black text-navy uppercase tracking-tighter leading-tight mb-6 md:mb-10 italic">
                    {item.text}
                  </h3>
                           </div>

                           <div className="flex items-center gap-4 md:gap-6 mt-auto">
                              <div className="w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl border-4 border-accent overflow-hidden shrink-0 shadow-lg">
                                 <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="text-base md:text-lg font-display font-black text-navy tracking-tight">{item.name}</div>
                                <div className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-0.5 italic">{item.role}</div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ))}
            </motion.div>
         </div>
      </div>
    </section>
  );
};

export const Impact: React.FC = () => {
  const stats = [
    { label: 'Active Fleet', value: '45.2K', icon: Truck },
    { label: 'Secured Nodes', value: '180+', icon: Database },
    { label: 'Annual Tonnage', value: '8.5M', icon: Anchor },
    { label: 'Client Trust', value: '99.9%', icon: ShieldCheck },
  ];

  return (
    <section id="impact" className="bg-navy py-32 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
           <div>
             <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 underline decoration-primary/20 underline-offset-8">Global Impact Report</div>
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.9]">
               Dominating the <br />
               <span className="italic text-primary">Logistics Era.</span>
            </h2>
           </div>
           <p className="text-gray-400 text-lg font-medium leading-relaxed">
             Our infrastructure is built for the challenges of tomorrow. We leverage proprietary AI and global transit nodes to ensure your cargo is always ahead of schedule.
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-10 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-3xl group"
            >
              <stat.icon className="w-8 md:w-10 h-8 md:h-10 text-primary mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500" />
              <div className="text-4xl md:text-5xl font-display font-black mb-2 italic tracking-tighter">
                <Counter value={stat.value} />
              </div>
              <div className="text-[10px] md:text-xs font-black tracking-[0.1em] text-gray-500 uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
