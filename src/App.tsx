/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, Footer } from './components/Layout';
import { Hero, HowItWorks, Impact, Testimonials } from './components/Landing';
import { ShipmentResult } from './components/ShipmentResult';
import { AdminLogin, AdminDashboard } from './components/Admin';
import { Shipment } from './types';
import { findShipment, generateDummyShipment, addToHistory } from './lib/storage';
import { TrackingHistory } from './components/TrackingHistory';
import { TrackingView } from './components/TrackingView';

type View = 'landing' | 'tracking' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Handle tracking search
  const handleSearch = (id: string) => {
    setIsSearching(true);
    setSearchError('');
    
    // Simulate network delay
    setTimeout(() => {
      const result = findShipment(id);
      if (result) {
        setActiveShipment(result);
        addToHistory(result.trackingId);
      } else if (id.length > 3) {
        // Dummy Mapping: Generate convincing data if not found
        const dummy = generateDummyShipment(id);
        setActiveShipment(dummy);
        addToHistory(dummy.trackingId);
      } else {
        setSearchError('Operational ID rejected by security layer.');
        alert('Tracking ID too short. Try "ST123456789" or any valid code.');
      }
      setIsSearching(false);
    }, 1500);
  };

  const toggleAdmin = () => {
    setCurrentView(currentView === 'admin' ? 'landing' : 'admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => {
    setActiveShipment(null);
  };

  const goHome = () => {
    setCurrentView('landing');
    setActiveShipment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTracking = () => {
    setCurrentView('tracking');
    setActiveShipment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-primary selection:text-white">
      {currentView !== 'admin' && (
        <Navbar 
          onAdminClick={toggleAdmin} 
          onHomeClick={goHome} 
          onTrackClick={goTracking}
          onSearch={handleSearch} 
        />
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onSearch={handleSearch} onHistoryClick={goTracking} isSearching={isSearching} />
              <HowItWorks />
              <Testimonials />
              <Impact />
              
              {/* Extra CTA - Modernized */}
              <section className="py-20 md:py-32 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/10 -skew-x-12 origin-top translate-x-1/4" />
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/50 underline decoration-white/20 underline-offset-8">Execute Lifecycle</div>
                  <h2 className="text-4xl md:text-7xl font-display font-black mb-8 md:mb-10 tracking-tighter uppercase leading-none italic">
                    Logistics. <br />
                    <span className="text-navy">Synchronized.</span>
                  </h2>
                  <p className="text-base md:text-lg font-medium mb-10 md:mb-12 max-w-xl mx-auto opacity-80 leading-relaxed italic">Ready to move at the speed of thought? Join the global network of elite distribution nodes today.</p>
                  <button 
                    onClick={goTracking}
                    className="bg-navy text-white px-10 md:px-16 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs hover:bg-white hover:text-navy transition-all shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] active:scale-95 uppercase tracking-widest italic"
                  >
                    Launch Manifest Tracker
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TrackingView onSearch={handleSearch} isSearching={isSearching} />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {!isAdminAuthenticated ? (
                <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
              ) : (
                <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Shipment Result Modal */}
      <AnimatePresence>
        {activeShipment && (
          <ShipmentResult 
            shipment={activeShipment} 
            onBack={closeModal} 
          />
        )}
      </AnimatePresence>

      {currentView !== 'admin' && <Footer onAdminClick={toggleAdmin} />}
    </div>
  );
}
