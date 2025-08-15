'use client'; 
// Next.js のクライアントコンポーネント指定（サーバーではなくブラウザで動作させる）

import React, { useState } from 'react';
import { ThreeCanvas } from '@/components/ThreeCanvas'; // 3D描画コンポーネント（Three.jsを使っている想定）
import { DialogueUI } from '@/components/DialogueUI'; // 会話UIコンポーネント
import { scenario } from './data/scenario'; // 会話のシナリオデータ（配列）

export default function InterviewPage() {
  // キャラクターが「話している状態」を管理するフラグ
  // isSpeaking が true の間、アニメーションや口パクなどを動かす用途
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 現在の会話ノード（シナリオの位置）を管理
  const [currentNodeId, setCurrentNodeId] = useState(1);

  // 現在表示すべき会話データを取得
  const currentNode = scenario.find(node => node.id === currentNodeId);

  // 選択肢をクリックしたときの処理
  const handleSelectOption = (nextId: number) => {
    // ▼▼▼ アニメーション開始のトリガー ▼▼▼
    setIsSpeaking(true);              // 話し始めの瞬間 → true
    setTimeout(() => setIsSpeaking(false), 100); 
    // 100ミリ秒後に false に戻す（瞬間的なトリガーとして使う）
    // これで「選択肢を選んだ瞬間」にだけ一瞬 isSpeaking=true になる
    // ▲▲▲ ここまで ▲▲▲

    // 会話の次のノードに移動
    setCurrentNodeId(nextId);
  };

  return (
    <div className="w-screen h-screen relative">
      {/* 背景の 3D 表示エリア */}
      <ThreeCanvas />
      
      
    </div>
  );
}
