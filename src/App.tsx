/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for cursor
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#C4C1D1] flex flex-col items-center justify-center p-4 font-sans overflow-hidden cursor-none">
      {/* SVG Filter for Gooey Effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Custom Cursor Bubble */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 bg-[#B6F08C] rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 2 : 1,
        }}
      />

      <div className="relative" style={{ filter: 'url(#goo)' }}>
        {/* Main Button */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-between px-8 py-4 rounded-full min-w-[240px] h-[72px] cursor-none overflow-hidden shadow-lg"
          animate={{
            backgroundColor: isHovered ? '#B6F08C' : '#1A1A1A',
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Text Container */}
          <div className="relative h-full flex items-center">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.span
                  key="get-in-touch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white text-xl font-medium"
                >
                  Get in touch
                </motion.span>
              ) : (
                <motion.span
                  key="dont-be-shy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-black text-xl font-medium"
                >
                  Don't be shy
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Animated Dot / Circle */}
          <motion.div
            className="flex items-center justify-center rounded-full"
            animate={{
              width: isHovered ? 48 : 12,
              height: isHovered ? 48 : 12,
              backgroundColor: isHovered ? '#1A1A1A' : '#B6F08C',
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ArrowRight className="text-white w-6 h-6" />
              </motion.div>
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Floating Chat Bubble - Outside the gooey filter to keep it sharp */}
      <div className="relative mt-4">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-md"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-pink-200">
                <img 
                  src="https://picsum.photos/seed/avatar/100/100" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-gray-800 font-medium">Hi!</span>
              <div className="absolute -top-1 right-8 w-2 h-2 bg-white rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
