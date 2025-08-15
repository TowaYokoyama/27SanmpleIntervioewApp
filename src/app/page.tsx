'use client';

import React, { useState } from 'react';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { DialogueUI } from '@/components/DialogueUI';
import { scenario } from './data/scenario';


export default function InterviewPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [currentNodeId, setCurrentNodeId] = useState(1);
  const currentNode = scenario.find(node => node.id === currentNodeId);

  const handleSelectOption = (nextId: number) => {
    // ▼▼▼ この部分を追加 ▼▼▼
    // アニメーションのきっかけを作る
    setIsSpeaking(true); // 一瞬だけtrueにして...
    setTimeout(() => setIsSpeaking(false), 100); // すぐにfalseに戻す
    // ▲▲▲ ここまで ▲▲▲
    
    setCurrentNodeId(nextId);
  };

  return (
    <div className="w-screen h-screen relative">
      <ThreeCanvas  />
      
      {currentNode && (
        <DialogueUI 
          node={currentNode}
          onSelectOption={handleSelectOption}
        />
      )}
    </div>
  );
}