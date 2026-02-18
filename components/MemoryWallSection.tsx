'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

// ScrollTrigger registration (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Memory {
  image: string;
  caption: string;
}

interface MemoryCardProps extends Memory {
  index: number;
}

interface MemoryWallSectionProps {
  memories?: Memory[];
}

// === Memory Card Component ===
// const MemoryCard: React.FC<MemoryCardProps> = ({ image, caption, index }) => {
//   const cardRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!cardRef.current) return;

//     gsap.fromTo(
//       cardRef.current,
//       {
//         opacity: 0,
//         y: 50,
//         rotate: index % 2 === 0 ? -5 : 5,
//       },
//       {
//         opacity: 1,
//         y: 0,
//         rotate: index % 2 === 0 ? 2 : -2,
//         duration: 1,
//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: cardRef.current,
//           start: 'top bottom-=100',
//           end: 'bottom center',
//           toggleActions: 'play none none reverse',
//         },
//       }
//     );
//   }, [index]);

//   return (
//     <div
//       ref={cardRef}
//       className={`w-64 md:w-80 mx-auto mb-12 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}
//     >
//       <Card className="overflow-hidden shadow-lg">
//         <CardContent className="p-0">
//           <div className= {`relative w-full aspect-[4/5] ${index === 1 ? 'h-36' : ''} `}>
//             <Image src={image} alt={caption} fill className="object-cover    " />
//           </div>
//           <div className="p-4 bg-white">
//             <p className="text-gray-800 text-sm md:text-base">{caption}</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

const MemoryCard: React.FC<MemoryCardProps> = ({ image, caption, index }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  console.log("MemeoryCard ", image)
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 50,
        rotate: index % 2 === 0 ? -5 : 5,
      },
      {
        opacity: 1,
        y: 0,
        rotate: index % 2 === 0 ? 2 : -2,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`w-64 md:w-80 mx-auto mb-12 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="relative w-full">
            <Image 
              src={image} 
              alt={caption} 
              width={320} 
              height={400} 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-4 bg-white">
            <p className="text-gray-800 text-sm md:text-base">{caption}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



// === Main Memory Wall Section ===
const   MemoryWallSection: React.FC<MemoryWallSectionProps> = ({ memories = [] }: MemoryWallSectionProps) => {
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
            <MemoryCard key={index} image={memory.image} caption={memory.caption} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryWallSection;
