'use client';

import React, { useState, useEffect } from 'react';
import { DialogueUI } from '@/components/DialogueUI';

import dynamic from 'next/dynamic';
import { scenario } from './data/scenario';

const ThreeCanvas = dynamic(
  () => import('@/components/ThreeCanvas').then(mod => mod.ThreeCanvas),
  { ssr: false }
);

export default function InterviewPage() {
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const [expression, setExpression] = useState<'neutral' | 'talking' | 'thinking'>('talking');
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // 最初は面接官のターン

  const currentNode = scenario.find((node: any) => node.id === currentNodeId);

  // 最初の質問を読み上げる処理
  useEffect(() => {
    // ページが読み込まれたら、2秒後に最初の質問を開始
    setTimeout(() => {
      setIsPlayerTurn(true); // プレイヤーのターンにする
      setExpression('neutral'); // 表情を通常に戻す
    }, 2000); // 最初のセリフの時間
  }, []);


  const handleSelectOption = (nextId: number) => {
    if (!isPlayerTurn || !scenario.find((node:any) => node.id === nextId)) return;

    setIsPlayerTurn(false);
    setExpression('thinking');

    // 1秒考える
    setTimeout(() => {
      setCurrentNodeId(nextId);
      setExpression('talking');

      // 2.5秒話す
      setTimeout(() => {
        // もし次の選択肢がなければ会話終了
        const nextNode = scenario.find((node:any) => node.id === nextId);
        if (nextNode && nextNode.options.length > 0) {
          setIsPlayerTurn(true);
          setExpression('neutral');
        } else {
          // 会話終了時の表情
          setExpression('neutral');
        }
      }, 2500);

    }, 1000);
  };

  return (
    <div className="w-screen h-screen relative">
      <ThreeCanvas expression={expression} />
      
      {currentNode && (
        <DialogueUI 
          node={currentNode}
          onSelectOption={handleSelectOption}
          isPlayerTurn={isPlayerTurn} // ターン情報をUIに渡す
        />
      )}
    </div>
  );
}
