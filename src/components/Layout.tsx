import React, { useState } from 'react';
import { 
  Package, Search, LayoutDashboard, Truck, Shield, MapPin, ListTodo, 
  Phone, Mail, Clock, Instagram, Twitter, Facebook, ArrowUpRight, 
  Menu, X, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC<{ onAdminClick: () => void; onHomeClick: () => void; onTrackClick: () => void; onSearch: (id: string) => void }> = ({ onAdminClick, onHomeClick, onTrackClick, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trackId, setTrackId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      onSearch(trackId.trim());
      setTrackId('');
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Home', action: onHomeClick, href: '#' },
    { label: 'Track Shipment', action: onTrackClick, href: '#' },
    { label: 'Solutions', href: '#services' },
    { label: 'Insights', href: '#impact' },
    { label: 'Network', href: '#testimonials' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Sub Navbar / Info Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 transition-colors hover:text-primary cursor-pointer"><Phone className="w-3 h-3 text-primary" /> +1 (800) 123-4567</span>
            <span className="flex items-center gap-2 transition-colors hover:text-primary cursor-pointer"><Mail className="w-3 h-3 text-primary" /> worldbridgelogistics73@gmail.com</span>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-primary" /> Ops: 24/7 Global Sync</span>
            <div className="flex gap-4 border-l border-gray-100 pl-6 ml-2">
               <Twitter className="w-3 h-3 hover:text-primary cursor-pointer transition-colors" />
               <Instagram className="w-3 h-3 hover:text-primary cursor-pointer transition-colors" />
               <Facebook className="w-3 h-3 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="mx-auto max-w-7xl mt-4 px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] px-4 md:px-8 h-20 flex items-center justify-between transition-all duration-300">
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={onHomeClick}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
               <Truck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tighter text-navy leading-none">WORLDBRIDGE</span>
              <span className="font-display font-bold text-[10px] tracking-[0.3em] text-primary leading-none uppercase mt-0.5">Logistics</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                onClick={item.action}
                className="relative text-[10px] font-black text-gray-400 hover:text-navy transition-colors tracking-widest uppercase py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Nav Tracking Input */}
            <form onSubmit={handleTrackSubmit} className="hidden md:flex relative group">
              <input 
                type="text" 
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="Quick Track ID..."
                className="w-48 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all text-navy placeholder:text-gray-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-navy hover:bg-primary hover:text-white transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden p-8 space-y-8"
            >
              <nav className="flex flex-col gap-6">
                {menuItems.map((item) => (
                  <a 
                    key={item.label}
                    href={item.href}
                    onClick={() => { 
                      item.action?.(); 
                      setIsMenuOpen(false); 
                    }}
                    className="text-sm font-black text-navy uppercase tracking-[0.2em] flex items-center justify-between group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </nav>
              <div className="h-px bg-gray-100" />
              <form onSubmit={handleTrackSubmit} className="relative group">
                <input 
                  type="text" 
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Insert Tracking ID"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all text-navy placeholder:text-gray-300"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-xl">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export const Footer: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => (
  <footer className="bg-white text-navy pt-32 pb-12 border-t border-gray-50">
    <div className="max-w-7xl mx-auto px-6">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <Truck className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter text-navy leading-none">WORLDBRIDGE</span>
                <span className="font-display font-bold text-xs tracking-[0.3em] text-primary uppercase leading-none mt-1">Logistics</span>
              </div>
            </div>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md mb-12 italic">
              Transforming global commerce through intelligent logistics and high-speed distribution nodes. We connect markets to people.
            </p>
            <div className="flex gap-4">
               {[Twitter, Instagram, Facebook].map((Icon, i) => (
                 <div key={i} className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer group">
                   <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 </div>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-black text-navy uppercase tracking-[0.3em] mb-10">Solutions</h4>
              <ul className="space-y-5 text-gray-400 font-bold text-sm">
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#services">Air Express</a></li>
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#services">Ocean Freight</a></li>
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#services">Railway Link</a></li>
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#services">Storage Hubs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-navy uppercase tracking-[0.3em] mb-10">Company</h4>
              <ul className="space-y-5 text-gray-400 font-bold text-sm">
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#impact">Global Policy</a></li>
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#impact">Safety Protocols</a></li>
                <li onClick={onAdminClick} className="hover:text-primary transition-colors cursor-pointer capitalize italic">Admin Gateway</li>
                <li className="hover:text-primary transition-colors cursor-pointer capitalize italic"><a href="#testimonials">Career Portal</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black text-navy uppercase tracking-[0.3em] mb-10 text-primary">Global Access</h4>
              <p className="text-gray-400 text-sm font-medium mb-8">Ready to scale your business with elite distribution?</p>
              <button className="w-full py-5 px-6 bg-navy text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-navy/10 flex items-center justify-center gap-3 group">
                Full Integration
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
       </div>
       
       <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-300 italic">
          <p>© 2026 WORLDBRIDGE LOGISTICS INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12">
            <span className="hover:text-navy cursor-pointer transition-colors border-b border-transparent hover:border-navy">Protocol Policy</span>
            <span className="hover:text-navy cursor-pointer transition-colors border-b border-transparent hover:border-navy">Terms of Engagement</span>
          </div>
       </div>
    </div>
  </footer>
);
