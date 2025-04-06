import {
  Environment,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BirthdayCard3D from './BDYCard';

// type CardProps = {
//   message: string;
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// };


type BirthdayCardSectionProps = {
  message?: string;
};

const BirthdayCardSection: React.FC<BirthdayCardSectionProps> = ({
  // message = 'Wishing you joy, laughter, and all the love in the world on your special day!'
}) => {
  const [isOpen] = useState<boolean>(false);

  return (
    <motion.div
      className="w-full h-screen bg-gradient-to-b from-black via-rose-700 to-black "
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4">
          Your Special Day
        </h2>

        <div className="w-full h-[60vh] sm:h-[70vh] md:h-[75vh] overflow-hidden">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 2, 6]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <OrbitControls enableZoom={false} enableRotate={true} enablePan={true} />
            <BirthdayCard3D />
            <Environment preset="sunset" />
          </Canvas>
        </div>

        <p className="text-center text-purple-700 mt-4 px-4">
          {!isOpen ? 'Tap the card to open it!' : 'A special message just for you ❤️'}
        </p>
      </div>
    </motion.div>
  );
};

export default BirthdayCardSection;
