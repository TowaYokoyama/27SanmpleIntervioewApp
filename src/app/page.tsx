'use client'; 

import React, { useState } from 'react';
import { DialogueUI } from '@/components/DialogueUI';

import dynamic from 'next/dynamic';
import { scenario } from './data/scenario';

const ThreeCanvas = dynamic(
  () => import('@/components/ThreeCanvas').then(mod => mod.ThreeCanvas),
  { ssr: false }
);

export default function InterviewPage() {
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const currentNode = scenario.find((node:any) => node.id === currentNodeId);
  
  // --- ▼▼▼ 表情とターンの状態管理を追加 ▼▼▼ ---
  const [expression, setExpression] = useState<'neutral' | 'talking' | 'thinking'>('talking');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  // --- ▲▲▲ ここまで ▲▲▲ ---

  const handleSelectOption = (nextId: number) => {
    if (!isPlayerTurn) return; // プレイヤーのターンでなければ何もしない

    setIsPlayerTurn(false); // プレイヤーのターンを終了
    setExpression('thinking'); // 面接官が「考え中」の表情になる

    // 1秒後に、面接官が話し始める
    setTimeout(() => {
      const nextNode = scenario.find((node:any) => node.id === nextId);
      if (nextNode) {
        setCurrentNodeId(nextId); // 次の会話に進む
        setExpression('talking'); // 面接官が「会話中」の表情になる

        // 2.5秒後に、面接官が話し終わり、プレイヤーのターンになる
        setTimeout(() => {
          setExpression('neutral'); // 面接官が「通常」の表情に戻る
          setIsPlayerTurn(true); // プレイヤーのターンを開始
        }, 2500); // この時間はセリフの長さに応じて調整

      }
    }, 1000); // 考える時間
  };

  return (
    <div className="w-screen h-screen relative">
      <ThreeCanvas expression={expression} /> {/* 現在の表情をThreeCanvasに渡す */}
      
      {currentNode && (
        <DialogueUI 
          node={currentNode}
          onSelectOption={handleSelectOption}
          // isPlayerTurn={isPlayerTurn} // 必要であればUIに渡してボタンを無効化なども可能
        />
      )}
    </div>
  );
}
