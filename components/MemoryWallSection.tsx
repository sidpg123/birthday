import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// import { Image } from '@/components/ui/image'; // Assuming shadcn-compatible
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

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

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Memory Card Component
const MemoryCard: React.FC<MemoryCardProps> = ({ image, caption, index }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

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
          <div className="relative h-64 w-full">
            <Image src={image} alt={caption} fill className="object-cover" />
          </div>
          <div className="p-4 bg-white">
            <p className="text-gray-800 text-sm md:text-base">{caption}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Memory Wall Section
const MemoryWallSection: React.FC<MemoryWallSectionProps> = ({ memories = [] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    {
      image: '/images/memory4.jpg',
      caption: 'Your graduation day. So proud of you!',
    },
    {
      image: '/images/memory5.jpg',
      caption: 'That crazy road trip where we got lost for 3 hours!',
    },
  ];

  const memoriesToShow = memories.length > 0 ? memories : defaultMemories;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen py-20 overflow-hidden bg-gradient-to-b from-black to-transparent"
    >

      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-black"
        style={{
          backgroundImage: "url('/images/wooden-wall.jpg')",
          y: backgroundY,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
          Our Memories Together
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
