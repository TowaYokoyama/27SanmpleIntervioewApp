import React, { useRef, useEffect } from 'react';
// React本体と、参照を保持するuseRef、ライフサイクル処理用のuseEffectをインポート。

import { useGLTF, useAnimations } from '@react-three/drei';
// @react-three/dreiは@react-three/fiber用の便利拡張集。
// useGLTF → GLTF/GLBモデルを読み込むフック。
// useAnimations → 読み込んだモデルに含まれるアニメーションを制御するフック。

// あなたが取得したモデルのURL（GLB形式の3Dモデルデータ）
const MODEL_PATH = 'https://models.readyplayer.me/689da2507c6c17df66c8f4a1.glb';
// Ready Player Meで作成された人物モデルがここにある。
// .glbは3Dモデル＋マテリアル＋アニメーションが1ファイルに含まれる形式。

type AnimatedInterviewerProps = {
  isSpeaking: boolean;
  scale?: number; // scaleを受け取れるようにする（?は任意プロパティ）
  position?: [number, number, number]; // positionを受け取れるようにする
  rotation?: [number, number, number];
};

export function AnimatedInterviewer({ isSpeaking, ...props }:  AnimatedInterviewerProps) {
  // groupは3Dオブジェクトを参照するためのref。
  // Canvas内でモデルの位置やアニメを制御するために必要。
  const group = useRef(null);

  // useGLTFでモデルを読み込む。
  // scene → モデル本体（Three.jsのSceneオブジェクト）
  // animations → モデルに含まれるすべてのアニメーションデータ
  const { scene, animations } = useGLTF(MODEL_PATH);

  // useAnimationsでアニメーション操作用の"actions"を取得。
  // actionsは { アニメ名: AnimationAction } の形でアクセスできる。
  // 第2引数にgroupを渡すことで、このrefが指すオブジェクトに適用される。
  const { actions } = useAnimations(animations, group);

  // isSpeakingプロパティの変化に応じて再生アニメーションを切り替える処理
  useEffect(() => {
    // Ready Player Meモデルが持っているアニメーション名（仕様によって名前は固定）
    const idleAction = actions['v1.stand_idle']; // 待機モーション
    const talkingAction = actions['v1.talk'];    // 会話モーション

    if (isSpeaking) {
      // 会話中の場合 → 待機モーションをフェードアウト、会話モーションをフェードインして再生
      if (idleAction && talkingAction) {
        idleAction.fadeOut(0.3); // 0.3秒で待機動作を消す
        talkingAction.reset().fadeIn(0.3).play(); // 会話動作を0.3秒でフェードイン
      }
    } else {
      // 会話していない場合 → 会話モーションをフェードアウト、待機モーションをフェードインして再生
      if (idleAction && talkingAction) {
        talkingAction.fadeOut(0.3);
        idleAction.reset().fadeIn(0.3).play();
      }
    }
  }, [isSpeaking, actions]); 
  // ↑ isSpeakingやactionsが変化するたびに実行される。
  // つまり、UI側(InterviewPage)からisSpeakingが変わるとここでアニメが切り替わる。

  // モデル初期表示時にアイドルアニメーションを再生する処理
  useEffect(() => {
    actions['v1.stand_idle']?.play();
  }, [actions]);
  // 初回マウント時、まだ話していない状態なので待機モーションを再生しておく。

  // <primitive> は@react-three/fiberで任意のThree.jsオブジェクトを直接挿入する方法。
  // scene → GLTFから読み込んだモデル本体
  // ref={group} → アニメーション制御や位置変更に使う
  // scale=1.2 → モデルのサイズを拡大
  // position-y={-1.6} → モデルを下に少し下げて画面内に収める
   return <primitive ref={group} object={scene} {...props} />;
}

// モデルを事前にロードしておくことで表示時の待機時間を短縮
useGLTF.preload(MODEL_PATH);
