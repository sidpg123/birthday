"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Firework() {
  const particles = useRef<THREE.Points>(null);
  const velocity = useRef<THREE.Vector3[]>([]);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    const count = 100; // Number of particles
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.5;
      const x = Math.cos(angle) * speed;
      const y = Math.sin(angle) * speed;
      const z = (Math.random() - 0.5) * 0.5;

      positions.set([0, 0, 0], i * 3); // Initial position
      velocities.push(new THREE.Vector3(x, y, z));
    }

    particles.current!.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    velocity.current = velocities;

    setTimeout(() => setIsExploded(true), 1500); // Hide after explosion
  }, []);

  useFrame(() => {
    if (!particles.current || isExploded) return;

    const positions = particles.current.geometry.attributes.position.array as Float32Array;
    velocity.current.forEach((vel, i) => {
      positions[i * 3] += vel.x * 0.05; // X movement
      positions[i * 3 + 1] += vel.y * 0.05; // Y movement (upward)
      positions[i * 3 + 2] += vel.z * 0.05; // Z movement
    });

    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial size={0.1} color="orange" />
    </points>
  );
}

export default function FireworksEffect({ trigger }: { trigger: boolean }) {
  return (
    trigger && (
      <Canvas className="absolute inset-0">
        <Firework />
      </Canvas>
    )
  );
}
