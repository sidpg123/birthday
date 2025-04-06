// components/BirthdayCard3D.tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, JSX } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';

export default function BirthdayCard3D(props: JSX.IntrinsicElements['group']) {
  const ref = useRef<Group>(null);

  const gltf = useGLTF('/models/birthday-card.glb');
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, ref);

  const { size } = useThree(); // Get viewport size
  const isMobile = size.width < 640;
  const isTablet = size.width < 768;

  // Dynamically adjust scale and position
  const scale = isMobile ? 0.6 : isTablet ? 0.8 : 1.4;
  const position = isMobile ? [0, -1.2, 0] : [0, -0.3, 0];

  useEffect(() => {
    // Play animation
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]!;
      firstAction.reset().play();
    }
  }, [actions]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.set(-2, 3.14, 3.1); // consistent angle
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={scale}
      position={position}
      {...props}
    />
  );
}
