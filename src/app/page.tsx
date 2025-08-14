'use client'; 
// Next.js 13+ のApp Router環境で、クライアントサイドレンダリング（CSR）を行うための宣言。
// これを書かないとこのコンポーネントはサーバーコンポーネント扱いになってしまう。

import React, { useState, Suspense } from 'react';
// React本体と、状態管理フック(useState)、遅延ロード用のSuspenseをインポート。
// Suspenseは3Dモデルなど非同期読み込みのUIを待機中表示するのに使う。

import { Canvas } from '@react-three/fiber';
// Three.jsをReact的に扱える@react-three/fiberのCanvasコンポーネント。
// <Canvas>内部に3Dシーンを構築する。

import { AnimatedInterviewer } from '@/AnimatedInterviewer';
// 面接官のアニメーションモデルを表示するコンポーネント。
// 実際は別ファイルで作られる。isSpeaking状態を受け取って動きを変える想定。

// プレースホルダーの3Dコンポーネント（仮のモデル表示用）
const Placeholder3D = () => {
  return (
    <mesh> 
      {/* Three.jsの基本ジオメトリ。meshはオブジェクト全体の入れ物 */}
      <boxGeometry args={[1, 1.8, 1]} /> 
      {/* 幅1, 高さ1.8, 奥行1 の直方体。人物の代わりっぽい形 */}
      <meshStandardMaterial color="royalblue" /> 
      {/* 標準マテリアル。青色で塗る */}
    </mesh>
  );
};

export default function InterviewPage() {
  // 面接の進行状況を表す状態。'idle'は未開始、'asking'は質問中、など。
  const [gameState, setGameState] = useState('idle');

  // 現在の質問文を保持する
  const [question, setQuestion] = useState('');

  // ユーザーの回答テキストを保持する
  const [answer, setAnswer] = useState('');

  // モデルが話しているかどうかのフラグ（アニメーション制御用）
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleStart = () => {
    setGameState('asking'); 
    // 状態を「質問中」に変更。これによりボタンや表示が変わる。

    setQuestion('自己紹介をお願いします。'); 
    // 最初の質問をセット。右UIの「質問エリア」に反映される。

    // ここで音声認識の開始処理を将来的に追加予定
  };

  return (
    <div className="w-screen h-screen bg-gray-800 text-white flex font-sans">
      {/* 全画面のレイアウト。Tailwind CSSで幅高さ全体に広げ、背景・文字色設定。flexで左右分割 */}

      {/* 左半分: 3Dモデル表示エリア */}
      <div className="w-1/2 h-full">
        <Canvas camera={{ position: [0, 0, 2.5] }}>
          {/* Canvas内はThree.jsのシーン。カメラ位置をz=2.5に設定 */}

          <ambientLight intensity={1.5} /> 
          {/* 全方向から当たるライト。モデルを全体的に明るくする。 */}

          <directionalLight position={[3, 3, 3]} /> 
          {/* 特定方向からの光源。影や立体感を作る。 */}

          <Suspense fallback={null}>
            {/* AnimatedInterviewerが非同期ロードされる間は何も表示しない（fallback=null） */}

            <AnimatedInterviewer isSpeaking={isSpeaking}/>
            {/* 実際の面接官モデル。isSpeakingの状態で口パク等のアニメを切り替える想定。 */}

            {/*<Placeholder3D />*/}
            {/* 実際のモデルがまだない場合に代わりに表示する仮オブジェクト。 */}
          </Suspense>
        </Canvas>
      </div>

      {/* 右半分: UIエリア */}
      <div className="w-1/2 h-full p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">AI模擬面接</h1>
        {/* タイトル表示 */}

        {/* 質問表示エリア */}
        <div className="flex-grow bg-gray-900 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-400">質問</h2>
          <p className="text-xl">
            {gameState === 'idle' 
              ? '「面接開始」ボタンを押してください。' // idle時の案内文
              : question // 質問中は現在の質問文を表示
            }
          </p>
        </div>

        {/* 回答表示エリア */}
        <div className="flex-grow bg-gray-900 rounded-lg p-4">
           <h2 className="text-lg font-semibold mb-2 text-gray-400">あなたの回答</h2>
           <p className="text-xl text-gray-300">
            {answer || '...'} 
            {/* 回答が空なら「...」と表示 */}
           </p>
        </div>

        {/* ボタンエリア */}
        <div className="flex justify-center items-center h-20">
          {gameState === 'idle' && (
            <button 
              onClick={handleStart} 
              // 押すとhandleStartが呼ばれ、質問開始状態へ移行
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
            >
              面接開始
            </button>
          )}
          {gameState === 'asking' && (
             <button 
              disabled 
              className="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg text-xl animate-pulse"
            >
              回答中...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
