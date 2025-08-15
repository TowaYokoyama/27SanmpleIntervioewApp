'use client';

import { ScenarioNode } from "@/app/data/scenario";



// このコンポーネントが受け取るpropsの型定義
type DialogueUIProps = {
  node: ScenarioNode;
  onSelectOption: (nextId: number) => void;
  isPlayerTurn: boolean; // ← isPlayerTurnを受け取るように追加
};

export function DialogueUI({ node, onSelectOption, isPlayerTurn }: DialogueUIProps) {
  if (!node) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-5 text-white font-sans">
      <div className="w-full md:w-2/3 mx-auto bg-black bg-opacity-70 p-6 rounded-xl border border-gray-700 shadow-lg">
        <p className="text-xl mb-6 min-h-[4rem]">{node.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {node.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectOption(option.nextId)}
              // isPlayerTurnがfalseの時は、ボタンを無効化して見た目も変える
              disabled={!isPlayerTurn}
              className={`
                w-full text-left p-4 rounded-lg transition-all border
                ${isPlayerTurn
                  ? 'bg-blue-800 bg-opacity-50 hover:bg-opacity-100 border-blue-500 cursor-pointer'
                  :'bg-gray-700 bg-opacity-50 border-gray-600 cursor-not-allowed'
                }
              `}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
