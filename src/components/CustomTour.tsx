/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Lightbulb } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
}

interface CustomTourProps {
  steps: TourStep[];
  tourKey: string;
}

export default function CustomTour({ steps = [], tourKey }: CustomTourProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isElementFound, setIsElementFound] = useState(false);
  
  const requestRef = useRef<number | null>(null);
  const storageKey = `hasSeenTour_${tourKey}`;

  // Fungsi sinkronisasi koordinat yang sangat sensitif
  const updateCoords = useCallback(() => {
    if (!steps || steps.length === 0 || currentStep === -1) return;

    const targetSelector = steps[currentStep]?.target;
    if (!targetSelector) return;

    const el = document.querySelector(targetSelector) as HTMLElement;

    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsElementFound(true);
      }
    } else {
      setIsElementFound(false);
    }
    
    requestRef.current = requestAnimationFrame(updateCoords);
  }, [currentStep, steps]);

  useEffect(() => {
    if (currentStep !== -1) {
      requestRef.current = requestAnimationFrame(updateCoords);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentStep, updateCoords]);

  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const hasSeen = localStorage.getItem(storageKey);
    if (!hasSeen) {
      const timer = setTimeout(() => setCurrentStep(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey, steps]);

  const handleNext = () => {
    if (currentStep < (steps?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(-1);
    setIsElementFound(false);
    localStorage.setItem(storageKey, "true");
  };

  if (currentStep === -1 || !steps || steps.length === 0) return null;

  const isTooLow = coords.top + 280 > (typeof window !== 'undefined' ? window.innerHeight : 800);

  return (
    <div className="fixed inset-0 z-[1000001] pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={handleClose}>
        <defs>
          <mask id="tour-mask-v5">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.rect 
              // PERUBAHAN: Gunakan spring untuk gerakan organik yang "kenyal" namun cepat
              animate={{
                x: isElementFound ? coords.left - 10 : 0,
                y: isElementFound ? coords.top - 10 : 0,
                width: isElementFound ? Math.max(0, coords.width + 20) : 0,
                height: isElementFound ? Math.max(0, coords.height + 20) : 0,
              }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 120, 
                mass: 0.8 
              }}
              rx="14" 
              fill="black" 
            />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.8)" mask="url(#tour-mask-v5)" className="backdrop-blur-[2px]" />
      </svg>

      {/* PERUBAHAN: Hapus mode="wait" agar teks lama dan baru meluncur bersamaan */}
      <AnimatePresence>
        {isElementFound && (
          <motion.div
            key={currentStep}
            // PERUBAHAN: Animasi slide yang lebih dinamis
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              top: isTooLow ? coords.top - 220 : coords.top + coords.height + 25,
              left: Math.max(15, Math.min((typeof window !== 'undefined' ? window.innerWidth : 1000) - 315, coords.left - 5))
            }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 100 
            }}
            className="absolute pointer-events-auto w-[300px] bg-card border border-border p-6 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Lightbulb size={14} className="fill-primary/20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Guided Tour</span>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-black uppercase italic tracking-tight leading-none mb-2 text-foreground">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-muted-foreground text-[12px] font-medium leading-relaxed mb-6">
              {steps[currentStep]?.content}
            </p>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-primary' : 'w-1 bg-border'}`} />
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                {currentStep === steps.length - 1 ? "Selesai" : "Lanjut"}
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}