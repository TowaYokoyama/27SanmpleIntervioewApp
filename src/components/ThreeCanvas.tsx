'use client';
// Next.js App Router でクライアントサイド実行されるコンポーネントであることを指定


import { Suspense } from 'react';
// React の Suspense コンポーネントをインポート（非同期読み込みに対応）

import { Canvas } from '@react-three/fiber';
// react-three-fiber の Canvas をインポート（3Dシーンの描画領域を作成する）

import { OrbitControls } from '@react-three/drei';
// Drei から OrbitControls をインポート（マウス操作でカメラを動かせるようにする）

import { OfficeScene } from './OfficeScreen';
// 別ファイルから OfficeScene コンポーネントを読み込み（背景や環境の3Dシーン）

import { VrmAvatar } from './VrmAvatar';
// VRMモデルを表示する VrmAvatar コンポーネントをインポート


// ▼ 親コンポーネント(page.tsx) の型に合わせて props を定義 ▼
type ThreeCanvasProps = {
  expression: 'neutral' | 'talking' | 'thinking'; 
  // ThreeCanvas に渡される表情指定（neutral / talking / thinking）
};


// ThreeCanvas コンポーネントを定義
// props から expression を受け取る
export function ThreeCanvas({ expression }: ThreeCanvasProps) {
  return (
    <div className="w-full h-full">
      {/* react-three-fiber の Canvas 内に 3Dシーンを描画 */}
      <Canvas camera={{ position: [-0.5, 1.5, 3], fov: 60 }}>
        {/* 環境光を設定（全体を明るくする） */}
        <ambientLight intensity={0.8} />

        {/* 平行光源を追加（太陽光のような効果） */}
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

        {/* コンポーネントの遅延読み込みに対応するため Suspense を使用 */}
        <Suspense fallback={null}>
          {/* オフィス背景シーン */}
          <OfficeScene />

          {/* VRMアバターを表示 */}
          <VrmAvatar
            // VRMファイルのURLを指定
            // ファイル名に日本語が含まれると環境依存でエラーになる場合があるので注意
            vrmUrl="/面接官A.vrm" 

            // ThreeCanvas で受け取った expression を
            // VrmAvatar の型 (neutral / happy / angry / sad / relaxed) に変換
            expression={
              expression === 'talking' ? 'happy' : 
              expression === 'thinking' ? 'relaxed' : 
              'neutral'
            }

            // モデルのスケール調整
            scale={1.05}

            // モデルの位置（少し前に配置）
            position={[0, 0, 0.5]}

            // モデルを反転させて正面を向かせる（Y軸回転）
            rotation={[0, Math.PI, 0]}
          />
        </Suspense>

        {/* マウスでカメラ操作できるようにする（注視点はキャラクターの頭付近） */}
        <OrbitControls target={[0, 1.2, 0]} />
      </Canvas>
    </div>
  );
}
