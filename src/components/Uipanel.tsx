'use client';

type UiPanelProps = {
  gameState: string;
  question: string;
  answer: string;
  onStart: () => void;
  onStop: () => void;
};

export function UiPanel({ gameState, question, answer, onStart, onStop }: UiPanelProps) {
  return (
    <div className="w-1/2 h-full p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">AI模擬面接</h1>
      
      <div className="flex-grow bg-gray-900 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-400">質問</h2>
        <p className="text-xl">{question}</p>
      </div>

      <div className="flex-grow bg-gray-900 rounded-lg p-4 min-h-0 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2 text-gray-400">あなたの回答</h2>
        <p className="text-xl text-gray-300 whitespace-pre-wrap">{answer}</p>
      </div>

      <div className="flex justify-center items-center h-20">
        {gameState === 'idle' && (
          <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl">
            面接開始
          </button>
        )}
        {gameState === 'listening' && (
          <button onClick={onStop} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl animate-pulse">
            回答を終了
          </button>
        )}
        {gameState === 'finished' && (
          <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl">
            次の質問へ
          </button>
        )}
      </div>
    </div>
  );
}