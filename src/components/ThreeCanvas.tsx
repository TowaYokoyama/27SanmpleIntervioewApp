'use client'; 

import { Suspense } from 'react';
import { Loader, OrbitControls } from '@react-three/drei';
import { PosedAvatar } from '@/components/PosedAvatar';
import { OfficeScene } from './OfficeScreen';
import { Canvas } from '@react-three/fiber';

// propsに`expression`を追加
type ThreeCanvasProps = {
  expression: 'neutral' | 'talking' | 'thinking';
};

export function ThreeCanvas({ expression }: ThreeCanvasProps) {
  return (
    <>
      <div className="w-2/3 h-full">
        <Canvas 
          camera={{ position: [-0.5, 1.5, 3], fov: 60 }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <OfficeScene />
            <PosedAvatar 
              expression={expression} // 親から受け取った表情をPosedAvatarに渡す
              scale={0.9}
              position={[-0.2, 0.1, 0.6]}
              rotation={[0.2, 3.14, 0.2]}
            />
          </Suspense>
          <OrbitControls target={[-0.2, 1, 0]} />
        </Canvas>
      </div>
      <Loader 
        containerStyles={{ background: 'rgba(0,0,0,0.7)' }} 
        barStyles={{ background: '#ff0' }} 
        dataStyles={{ color: '#fff' }}
      />
    </>
  );
}
