'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { UiPanel } from '@/components/Uipanel';


const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function InterviewPage() {
  // ▼▼▼ 状態管理とロジックはすべてここに集約 ▼▼▼
  const [gameState, setGameState] = useState('idle');
  const [question, setQuestion] = useState('「面接開始」ボタンを押してください。');
  const [answer, setAnswer] = useState('...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setAnswer(finalTranscript);
    };
    recognitionRef.current = recognition;
  }, []);

  const handleStartInterview = () => {
    setGameState('listening');
    setQuestion('自己紹介をお願いします。');
    setAnswer('');
    recognitionRef.current?.start();
  };

  const handleStopInterview = () => {
    setGameState('finished');
    recognitionRef.current?.stop();
  };
  // ▲▲▲ ここまでがロジック ▲▲▲

  // ▼▼▼ 表示部分はコンポーネントを呼び出すだけ ▼▼▼
  return (
    <div className="w-screen h-screen bg-gray-800 text-white flex font-sans">
      <ThreeCanvas isSpeaking={isSpeaking} />
      <UiPanel
        gameState={gameState}
        question={question}
        answer={answer}
        onStart={handleStartInterview}
        onStop={handleStopInterview}
      />
    </div>
  );
}