'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useRef } from 'react';
import MemoryCard from './MemoryCard';

// ScrollTrigger registration (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Memory {
  image: string;
  caption: string;
}



interface MemoryWallSectionProps {
  memories?: Memory[];
}


// === Main Memory Wall Section ===
const MemoryWallSection: React.FC<MemoryWallSectionProps> = ({ memories = [] }: MemoryWallSectionProps) => {


  const containerRef = useRef<HTMLDivElement | null>(null);
  console.log("Memoreis", memories);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const defaultMemories: Memory[] = [
    {
      image: '/images/memory1.jpg',
      caption: "Remember that amazing dinner at Luigi's last year?",
    },
    {
      image: '/images/memory2.jpg',
      caption: 'That time we climbed Mount Rainier and you were terrified!',
    },
    {
      image: '/images/memory3.jpg',
      caption: 'Beach day! You built the best sandcastle ever.',
    },
  ];

  const memoriesToShow = memories.length > 0 ? memories : defaultMemories;
  // Create an array of different petal images
  const petalImages = [
    '/images/petal1.png',
    '/images/petal2.png',
    '/images/petal3.png',
    '/images/petal.png',
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen py-20 overflow-hidden"
      style={{
        overflow: 'visible',
        background: 'linear-gradient(to bottom, #ffebef, #ffd6e0, #e6b3d1)',
      }}
    >

      {/* Parallax Wooden Wall Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('/images/wooden-wall.jpg')",
          y: backgroundY,
        }}
      />

      {/* Cherry Blossom Petals Animation - Fixed Version */}
      <div className="absolute inset-0  z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 200 }).map((_, i) => {
          // Use modulo to cycle through available petal images
          const petalImage = petalImages[i % petalImages.length];
          const size = 10 + Math.random() * 15; // Different sized petals

          return (
            // In your component:
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * -10}%`, // Start further above the viewport
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundImage: `url(${petalImage})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                opacity: 0.7 + Math.random() * 0.3,
                animation: `fall ${20 + Math.random() * 12}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                zIndex: 10
              }}
            />
          );
        })}
      </div>

      {/* Memory Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-pink-800 text-center mb-12 drop-shadow-md">
          Cherry Blossom Memories 🌸
        </h2>

        <div className="space-y-8 md:space-y-16">
          {memoriesToShow.map((memory, index) => (
            <MemoryCard key={index} imageUrl={memory.image} caption={memory.caption} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryWallSection;
