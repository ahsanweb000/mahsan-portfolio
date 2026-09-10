'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingIco({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#222222" roughness={0.6} metalness={0.3} wireframe={false} />
    </mesh>
  );
}

function FloatingTorus({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.07;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[1, 0.35, 16, 48]} />
      <meshStandardMaterial color="#1e1e1e" roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

function MorphingBlob({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.03;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#252525" roughness={0.4} metalness={0.5} />
      </mesh>
    </Float>
  );
}

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.06) * 0.8;
    state.camera.position.y = Math.cos(t * 0.04) * 0.4;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <CameraDrift />
      <pointLight position={[6, 6, 4]} intensity={2.5} color="#00E5FF" />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#111111" />
      <FloatingIco position={[-3.5, 1.5, -2]} scale={1.2} />
      <FloatingIco position={[4, -1, -3]} scale={0.8} />
      <FloatingIco position={[1.5, 2.8, -4]} scale={0.6} />
      <FloatingTorus position={[3.5, 2, -2.5]} scale={1.0} />
      <FloatingTorus position={[-4, -2, -4]} scale={0.7} />
      <MorphingBlob position={[0, 0, -3]} scale={1.4} />
      <MorphingBlob position={[-2.5, -2, -2]} scale={0.9} />
      <MorphingBlob position={[2.5, 1, -1.5]} scale={0.6} />
    </>
  );
}

export default function HeroScene() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {isDesktop && (
        <div
          className="hero-scene-desktop"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 6], fov: 55 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
            frameloop="always"
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div
        className="hero-scene-mobile"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 40%, #1a1a1a 0%, #0a0a0a 70%)',
        }}
      />

      <style>{`
        @media (min-width: 768px) {
          .hero-scene-desktop { display: block !important; }
          .hero-scene-mobile  { display: none !important; }
        }
        @media (max-width: 767px) {
          .hero-scene-desktop { display: none !important; }
          .hero-scene-mobile  { display: block !important; }
        }
      `}</style>
    </>
  );
}