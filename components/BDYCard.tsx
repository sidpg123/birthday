// components/BirthdayCard3D.tsx
"use client"
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState, JSX } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, TextureLoader, MeshStandardMaterial } from 'three';

type BirthdayCardProps = {
  isOpen: boolean;
  onCardClick: () => void;
  photoUrl: string; // ✅ Add this prop for dynamic texture
} & JSX.IntrinsicElements['group'];

export default function BirthdayCard3D({ isOpen, onCardClick, photoUrl, ...props }: BirthdayCardProps) {
  const ref = useRef<Group>(null);
  const [clicked, setClicked] = useState(false);

  const gltf = useGLTF('/models/birthday-card.glb');
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, ref);

  const { size } = useThree();
  const isMobile = size.width < 640;
  const isTablet = size.width < 768;

  const scale = isMobile ? 1.5 : isTablet ? 0.8 : 1.4;
  const position = isMobile ? [-0.2, -0.8, 0] : isTablet ? [0, -0.3, 0] : [0, -0.3, 0];

  // ✅ Load photo as texture and apply to 'PhotoFrame'
  // useEffect(() => {
  //   const photoMesh = scene.getObjectByName("PhotoFrame");

  //   if (photoMesh && 'material' in photoMesh && photoUrl) {
  //     const textureLoader = new TextureLoader();
  //     textureLoader.load(photoUrl, (texture) => {
  //       const material = photoMesh.material as MeshStandardMaterial;
  //       material.map = texture;
  //       material.needsUpdate = true;
  //     });
  //   }
  // }, [scene, photoUrl]);

  useEffect(() => {
    const photoMesh = scene.getObjectByName("PhotoFrame");

    if (photoMesh && "material" in photoMesh && photoUrl) {
      const textureLoader = new TextureLoader();

      textureLoader.load(photoUrl, (texture) => {
        texture.flipY = false;
        // texture.colorSpace = THREE.SRGBColorSpace;

        const originalMaterial = photoMesh.material as MeshStandardMaterial;
        const newMaterial = originalMaterial.clone();
        newMaterial.map = texture;
        newMaterial.needsUpdate = true;

        photoMesh.material = newMaterial;
      });

    }
  }, [scene, photoUrl]);
  // Play animation if card is opened
  useEffect(() => {
    if (isOpen && actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]!;
      firstAction.reset().play();
      setClicked(true);
    }
  }, [isOpen, actions]);

  // Rotate the card initially
  useFrame(() => {
    if (ref.current && !clicked) {
      ref.current.rotation.set(-2, 3.14, 3.1);
    }
  });

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

useGLTF.preload('/models/birthday-card.glb');
