import React, { useRef, useEffect } from 'react';
import { Stars } from '@react-three/drei'; // Assuming you're using @react-three/drei
import * as THREE from 'three';

const StarryBackground = () => {
  const starsRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0005; // Rotate around the Y-axis
        starsRef.current.rotation.x += 0.0002; // Rotate around the X-axis
      }
    }, 10);

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []);

  return (
    <group ref={starsRef}>
      <Stars
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.4}
        fade
        speed={0.5}
      />
    </group>
  );
};

export default StarryBackground;
