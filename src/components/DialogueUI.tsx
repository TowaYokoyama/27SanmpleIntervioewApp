'use client';

import { ScenarioNode } from "@/app/data/scenario";


type DialogueUIProps = {
  node: ScenarioNode;
  onSelectOption: (nextId: number) => void;
};

export function DialogueUI({ node, onSelectOption }: DialogueUIProps) {
  if (!node) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 text-white font-sans">
      <div className="w-full md:w-2/3 mx-auto bg-black bg-opacity-70 p-6 rounded-xl border border-gray-700 shadow-lg">
        <p className="text-xl mb-6 min-h-[6rem]">{node.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {node.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectOption(option.nextId)}
              className="w-full bg-blue-800 bg-opacity-50 hover:bg-opacity-100 border border-blue-500 text-left p-4 rounded-lg transition-all"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}