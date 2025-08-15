'use client';

import { Suspense } from 'react';

import { OrbitControls } from '@react-three/drei';
import { PosedAvatar } from '@/components/PosedAvatar'; // ← 新しいコンポーネントをインポート
import { OfficeScene } from './OfficeScreen';
import { Canvas } from '@react-three/fiber';


// isSpeakingはもう使わないので、Propsは空でもOK
type ThreeCanvasProps = {};

export function ThreeCanvas({}: ThreeCanvasProps) {
  return (
    <div className="w-1/2 h-full">
      <Canvas camera={{ position: [-0.5, 1.5, 3], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <OfficeScene />
          {/* ここを新しい<PosedAvatar />コンポーネントに差し替える */}
          <PosedAvatar 
            scale={0.9}
            position={[-0.2, 0.9, 0.4]} // 座らせるのでY座標を調整
            rotation={[0, 0.2, 0]}
          />
        </Suspense>
        
        <OrbitControls target={[-0.2, 1, 0]} />
      </Canvas>
    </div>
  );
}