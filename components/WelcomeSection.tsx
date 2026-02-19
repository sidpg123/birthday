// components/WelcomeSection.tsx
import { Button } from '@/components/ui/button';
import { animated, useSpring } from '@react-spring/three';
import { Environment, PerspectiveCamera, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { Group } from 'three';

type EnvelopeProps = {
  name: string;
  isOpen: boolean;
  onOpen: () => void;
};

const Envelope: React.FC<EnvelopeProps> = ({ name, isOpen, onOpen }) => {
  const envelopeRef = useRef<Group>(null);
  const letterRef = useRef<Group>(null);

  const envelopeProps = useSpring({
    positionY: isOpen ? -1 : 0,
    rotationX: 0,
  });

  const letterProps = useSpring({
    positionY: isOpen ? 1 : 0,
    positionZ: isOpen ? 0.1 : -0.1,
    scale: isOpen ? 1 : 0.8,
  });

  return (
    <group>
      <animated.group ref={envelopeRef} {...envelopeProps} onClick={!isOpen ? onOpen : undefined}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial color="#f5d0c5" />
        </mesh>

        <mesh position={[0, 0.1, -0.5]} rotation={isOpen ? [-Math.PI / 3, 0, 0] : [0, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 1.5]} />
          <meshStandardMaterial color="#f7d9d0" />
        </mesh>

        <Text
          position={[0, 0.15, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#a83254"
          //   font="/fonts/cursive.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </animated.group>

      <animated.group ref={letterRef} {...letterProps}>
        {isOpen && (
          <>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[2.8, 0.05, 1.8]} />
              <meshStandardMaterial color="white" />
            </mesh>

            <Text
              position={[0, 0.55, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.2}
              color="#333333"
              maxWidth={2.5}
              lineHeight={1.2}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              {`Happy Birthday ${name}!\n\nYou're amazing and deserve\nall the happiness today!`}
            </Text>
          </>
        )}
      </animated.group>
    </group>
  );
};

const Fireworks: React.FC = () => {
  const particles = useRef<
    {
      position: [number, number, number];
      color: string;
      size: number;
    }[]
  >([]);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  if (particles.current.length === 0) {
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10 + 3;
      const z = (Math.random() - 0.5) * 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 0.2 + 0.05;
      particles.current.push({ position: [x, y, z], color, size });
    }
  }

  return (
    <group>
      {particles.current.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial color={particle.color} emissive={particle.color} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

type WelcomeSectionProps = {
  name?: string;
  message?: string;
};

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  name = 'Friend',
  // message = "You're amazing!",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShowFireworks(true), 1000);

    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch((e) => console.log('Audio playback prevented:', e));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-pink-200 to-purple-200 flex flex-col justify-center items-center">
      <div className="w-full h-3/4 relative">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />

          <Suspense fallback={null}>
            <Envelope name={name} isOpen={isOpen} onOpen={handleOpen} />
            {showFireworks && <Fireworks />}
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>

      {!isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Button
            className="mt-64 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto"
            onClick={handleOpen}
          >
            Tap to Open Your Birthday Letter
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
