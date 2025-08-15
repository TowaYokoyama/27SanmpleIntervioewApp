'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OfficeScene } from './OfficeScreen';
import { AnimatedInterviewer } from '@/AnimatedInterviewer';


type ThreeCanvasProps = {
  isSpeaking: boolean;
};

export function ThreeCanvas({ isSpeaking }: ThreeCanvasProps) {
  return (
    <div className="w-1/2 h-full">
      <Canvas camera={{ position: [-0.5, 1.5, 3], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <OfficeScene />
          <AnimatedInterviewer 
            isSpeaking={isSpeaking} 
            scale={0.9}
            position={[-0.2, 0.05, 0.4]}
            rotation={[0, 0.2, 0]}
          />
        </Suspense>
        
        <OrbitControls target={[-0.2, 1, 0]} />
      </Canvas>
    </div>
  );
}