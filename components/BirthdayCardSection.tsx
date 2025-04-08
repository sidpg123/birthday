import {
  Environment,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useRef, useState } from 'react';
import BirthdayCard3D from './BDYCard';

type BirthdayCardSectionProps = {
  message?: string;
};

const BirthdayCardSection: React.FC<BirthdayCardSectionProps> = ({
  // message = 'Wish you joy, laughter, and all the love in the world on your special day!'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 2, 6]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startPositionRef = useRef<[number, number, number]>([0, 2, 6]);
  const targetPositionRef = useRef<[number, number, number]>([0, 2, 6]);

  // Animation duration in milliseconds
  const ANIMATION_DURATION = 2000;

  // Smooth easing function (ease-out cubic)
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Function to animate camera transition
  const animateCamera = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const easedProgress = easeOutCubic(progress);

    // Interpolate between start and target positions
    const x = startPositionRef.current[0] + (targetPositionRef.current[0] - startPositionRef.current[0]) * easedProgress;
    const y = startPositionRef.current[1] + (targetPositionRef.current[1] - startPositionRef.current[1]) * easedProgress;
    const z = startPositionRef.current[2] + (targetPositionRef.current[2] - startPositionRef.current[2]) * easedProgress;

    setCameraPosition([x, y, z]);

    // Continue animation if not finished
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateCamera);
    }
  };

  const handleCardClick = () => {
    setIsOpen(true);

    // Store current camera position as starting point
    startPositionRef.current = [...cameraPosition];
    startTimeRef.current = 0;

    // Set target position based on screen size
    if (window.innerWidth < 640) {
      targetPositionRef.current = [0, 2, 9]; // Mobile
    } else {
      targetPositionRef.current = [0, 2, 7]; // Desktop/tablet
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(animateCamera);
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="w-full h-screen bg-gradient-to-b from-black via-rose-700 to-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 drop-shadow-lg mb-6">
          Your Special Day
        </h2>

        <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-6"></div>



        <div className="w-full h-[60vh] sm:h-[70vh] md:h-[75vh] overflow-hidden">
        <Canvas dpr={[1, 2]} shadows >
            <PerspectiveCamera makeDefault position={cameraPosition} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <OrbitControls
              enableZoom={false}
              enableRotate={true}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              target={[0, 0, 0]}
            // Removed minAzimuthAngle and maxAzimuthAngle to allow full rotation
            />
            <Suspense fallback={null}>
            <BirthdayCard3D isOpen={isOpen} onCardClick={handleCardClick} />
            </Suspense>
            <Environment preset="sunset" />
          </Canvas>
        </div>

        <p className="text-center text-lg sm:text-xl mt-6 px-4 max-w-md text-white drop-shadow-md font-medium italic animate-pulse">
          {!isOpen ? 'Tap the card to open it!' : 'A special message just for you ❤️'}
        </p>

      </div>
    </motion.div>
  );
};

export default BirthdayCardSection;