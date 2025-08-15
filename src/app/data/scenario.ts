export type ScenarioNode = {
  id: number;
  question: string;
  options: {
    text: string;
    nextId: number;
  }[];
};

export const scenario: ScenarioNode[] = [
  {
    id: 1,
    question: "こんにちは。本日はよろしくお願いします。まずは自己紹介をお願いします。",
    options: [
      { text: "はい、サポーターズ大学のダヤン・ビシエドです。...", nextId: 2 },
      { text: "えーっと、何から話せば...", nextId: 100 }, // 詰まってしまうルート
    ],
  },
  {
    id: 2,
    question: "ありがとうございます。学生時代に最も力を入れたことは何ですか？",
    options: [
      { text: "ハッカソンでのチーム開発です。", nextId: 3 },
      { text: "アルバイトでの接客経験です。", nextId: 4 },
      { text: "学業です。", nextId: 5 },
    ],
  },
  {
    id: 3,
    question: "素晴らしいですね！ハッカソンではどのような役割を？",
    options: [
      { text: "バックエンド開発を担当しました。", nextId: 99 },
      { text: "主にリーダーとして全体をまとめました。", nextId: 99 },
      { text: 'お茶汲み係を担当していました。', nextId:99}
    ],
  },
  // ... 他の会話ルートもここに追加 ...
  {
    id: 99,
    question: "なるほど、よく分かりました。本日は以上です。ありがとうございました。",
    options: [], // 選択肢がない場合は会話終了
  },
  {
    id: 100,
    question: "落ち着いてください。ゆっくりで大丈夫ですよ。",
    options: [
        { text: "すみません、もう一度お願いします。", nextId: 1 }
    ],
  }
];