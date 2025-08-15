'use client'; 
// Next.js でこのコンポーネントをブラウザ側でレンダリングする宣言

import { Suspense } from 'react';

import { OrbitControls } from '@react-three/drei'; // カメラをマウスで操作できるコンポーネント
import { PosedAvatar } from '@/components/PosedAvatar'; // 新しいアバター表示用コンポーネント
import { OfficeScene } from './OfficeScreen'; // オフィスの背景シーン
import { Canvas } from '@react-three/fiber'; // React で Three.js を描画するためのコンポーネント

// isSpeaking は不要なので Props は空
type ThreeCanvasProps = {};

// ThreeCanvas コンポーネント本体
export function ThreeCanvas({}: ThreeCanvasProps) {
  return (
    // 表示領域（横幅67%、高さ100%）
    <div className="w-2/3 h-full">
      {/* Canvas: three.js のレンダリング領域 */}
      <Canvas 
        camera={{ position: [-0.5, 1.5, 3], fov: 60 }} // カメラ位置と視野角
      >
        {/* 環境光: 全体を均等に照らすライト */}
        <ambientLight intensity={0.8} />
        
        {/* 平行光源: 特定方向から照らす光（影や立体感を出す） */}
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        {/* Suspense: モデルやテクスチャの読み込み中に fallback を表示する仕組み */}
        <Suspense fallback={null}>
          {/* 背景のオフィスシーン */}
          <OfficeScene />

          {/* キャラクター（座った姿勢のアバター） */}
          <PosedAvatar 
            scale={0.9}                 // 全体を少し小さく
            position={[-0.2, 0.1, 0.4]} // 座らせたので高さ(Y)を調整
            rotation={[0, 0.2, 0]}      // 少し体を回転
          />
        </Suspense>
        
        {/* OrbitControls: カメラをマウスで回転・ズームできるようにする */}
        {/* target でカメラが注目する位置を指定 */}
        <OrbitControls target={[-0.2, 1, 0]} />
      </Canvas>
    </div>
  );
}
