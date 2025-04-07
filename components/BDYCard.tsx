// components/BirthdayCard3D.tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState, JSX } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';

type BirthdayCardProps = {
  isOpen: boolean;
  onCardClick: () => void;
} & JSX.IntrinsicElements['group'];

export default function BirthdayCard3D({ isOpen, onCardClick, ...props }: BirthdayCardProps) {
  const ref = useRef<Group>(null);
  const [clicked, setClicked] = useState(false);
  
  const gltf = useGLTF('/models/birthday-card.glb');
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, ref);

  const { size } = useThree(); // Get viewport size
  const isMobile = size.width < 640;
  const isTablet = size.width < 768;

  // Dynamically adjust scale and position based on device size
  // Mobile: Smaller scale to fit within screen
  const scale = isMobile ? 1.5 : isTablet ? 0.8 : 1.4;
  // Adjust position to center card and ensure it's visible
  const position = isMobile ? [-0.2, -0.8, 0] : isTablet ? [0, -0.3, 0] : [0, -0.3, 0];

  // Handle animation only when clicked
  useEffect(() => {
    if (isOpen && actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]!;
      firstAction.reset().play();
      setClicked(true);
    }
  }, [isOpen, actions]);

  // Initial position
  useFrame(() => {
    if (ref.current) {
      // Only set this fixed rotation if not clicked yet
      if (!clicked) {
        ref.current.rotation.set(-2, 3.14, 3.1); // Consistent initial angle
      }
    }
  });

  // Handle card click
  const handleClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    if (!clicked) {
      onCardClick();
    }
  };

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={scale}
      position={position}
      onClick={handleClick}
      {...props}
    />
  );
}