'use client';
import { Playfair_Display } from 'next/font/google';

import { Center, PerspectiveCamera, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import StarryBackground from './StarryBackground';

// Initialize the font
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
});

type FinalGreetingSectionProps = {
  message?: string;
  name?: string;
};


// Animated 3D Text Message with precise animation
const GreetingMessage = ({ message }: { message: string }) => {
  const textGroupRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    // Start animation after 1s
    const timeout = setTimeout(() => setVisible(true), 1000);

    // Scale-up animation
    const interval = setInterval(() => {
      setScale(prev => {
        const next = prev + 0.05;
        if (next >= 1) {
          clearInterval(interval);
          return 1;
        }
        return next;
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <group ref={textGroupRef} visible={visible}>
      <Center>
        <Text
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          lineHeight={1.5}
          textAlign="center"
          scale={[scale, scale, scale]}
        >
          {message}
          <meshStandardMaterial
            color="white"
            emissive="#8a2be2"
            emissiveIntensity={0.4}
            transparent
            opacity={scale}
          />
        </Text>
      </Center>
    </group>
  );
};
// Main Component
export default function FinalGreetingSection({
  message = 'Hope you enjoyed the surprise! Wishing you the best year ever!',
  name = 'Your Friend',
}: FinalGreetingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.3 // Trigger when 30% of the component is visible
  });

  // const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [titleAnimated, setTitleAnimated] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  // Title animation sequence with letters
  const title = "Happy Birthday!";
  const titleLetters = title.split("");

  // Play audio function with user interaction
  // const playAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play()
  //       .then(() => setIsAudioPlaying(true))
  //       .catch((e) => console.log('Audio playback prevented:', e));
  //   }
  // };

  // Detect scroll into view and start animation sequence
  useEffect(() => {
    if (isInView && !hasScrolledIntoView) {
      setHasScrolledIntoView(true);

      // Start animation sequence
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2500);

      const titleTimer = setTimeout(() => {
        setTitleAnimated(true);
      }, 1500);

      return () => {
        clearTimeout(timer);
        clearTimeout(titleTimer);
      };
    }
  }, [isInView, hasScrolledIntoView]);

  // Sequence animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    const titleTimer = setTimeout(() => {
      setTitleAnimated(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(titleTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-black overflow-hidden ${playfair.className}`}
      // onClick={playAudio}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/sounds/birthday-song.mp3"
        preload="auto"
        loop
      />

      {/* 3D Canvas - Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <StarryBackground />
        </Canvas>
      </div>

      {/* Text Animations Layer */}
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Letter-by-letter animated title */}
          <div className="relative h-24 mb-12 overflow-visible">
            <div className="flex justify-center">
              {titleLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className={`text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 inline-block`}
                  initial={{
                    y: -100,
                    opacity: 0,
                    rotate: -10
                  }}
                  animate={{
                    y: hasScrolledIntoView ? 0 : -100,
                    opacity: hasScrolledIntoView ? 1 : 0,
                    rotate: hasScrolledIntoView ? 0 : -10
                  }}
                  transition={{
                    delay: hasScrolledIntoView ? (0.3 + index * 0.1) : 0,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            {/* Sparkle effects around title once animated */}
            {titleAnimated && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {animationComplete && (
            <motion.div
              className="w-full max-w-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* 3D Message Canvas - separate from background */}
              <div className="w-full h-40 mb-8 ">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={1} />
                  <GreetingMessage message={message} />
                </Canvas>
              </div>

              {/* <motion.div
                className="flex justify-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg shadow-lg transform transition-all hover:scale-105 relative overflow-hidden group"
                  onClick={playAudio}
                >
                  <span className="relative z-10">
                    {isAudioPlaying ? "♫ Playing Music ♫" : "Play Birthday Song"}
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{
                      x: isAudioPlaying ? ["100%", "0%"] : "100%"
                    }}
                    transition={{
                      duration: isAudioPlaying ? 2 : 0,
                      repeat: isAudioPlaying ? Infinity : 0,
                      ease: "linear"
                    }}
                  />
                </Button>
              </motion.div> */}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced floating particles effect */}
      {hasScrolledIntoView && (
        <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${i % 3 === 0 ? "bg-purple-500" : i % 3 === 1 ? "bg-pink-500" : "bg-blue-500"
                } opacity-70`}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100
              }}
              animate={{
                y: -100,
                x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>

      )}

      {/* Footer with animation */}
      <motion.div
        className="absolute bottom-6 w-full text-center text-white z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasScrolledIntoView ? 1 : 0 }}
        transition={{ delay: hasScrolledIntoView ? 3 : 0, duration: 1 }}
      >
        <motion.p
          className="font-light text-lg"
          animate={{
            y: hasScrolledIntoView ? [0, -5, 0] : 0,
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          Made with{' '}
          <motion.span
            className="inline-block text-red-500"
            animate={{
              scale: hasScrolledIntoView ? [1, 1.2, 1] : 1,
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            ❤️
          </motion.span>
          {' '}by <span className="font-medium">{name}</span>
        </motion.p>
      </motion.div>

      {/* <div className="absolute bottom-16 right-6 z-50">
        <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2 shadow-lg">
          Create Your Own
        </Button>
      </div> */}
    </div>
  );
}