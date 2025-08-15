'use client';

import { useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, JSX } from 'react';
import * as THREE from 'three';

const MODEL_PATH = 'https://models.readyplayer.me/689da2507c6c17df66c8f4a1.glb';

// propsに表情をコントロールするための`expression`を追加
type PosedAvatarProps = JSX.IntrinsicElements['group'] & {
  expression: 'neutral' | 'talking' | 'thinking';
};

export function PosedAvatar({ expression, ...props }: PosedAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  // --- ▼▼▼ ここから表情を制御する新しいロジック ▼▼▼ ---
  useEffect(() => {
    if (!scene) return;
    
    // モデルの中から表情データ(ブレンドシェイプ)を持つメッシュを探す
    const mesh = scene.getObjectByName('Wolf3D_Avatar') as THREE.SkinnedMesh;
    if (!mesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;

    const influences = mesh.morphTargetInfluences; // 全ての表情スライダー
    const dict = mesh.morphTargetDictionary;     // 表情の名前と番号の対応表

    // 必要な表情の名前をdictから探しておく
    const mouthOpenIndex = dict['mouthOpen'];
    const frownIndex = dict['browDownLeft']; // 眉をひそめる表情

    // 親から渡された`expression`に応じて、表情スライダーの値を変更
    switch (expression) {
      case 'talking':
        if (mouthOpenIndex !== undefined) influences[mouthOpenIndex] = 0.4;
        if (frownIndex !== undefined) influences[frownIndex] = 0;
        break;
      case 'thinking':
        if (mouthOpenIndex !== undefined) influences[mouthOpenIndex] = 0;
        if (frownIndex !== undefined) influences[frownIndex] = 0.8; // 眉をひそめる
        break;
      default: // 'neutral'
        if (mouthOpenIndex !== undefined) influences[mouthOpenIndex] = 0;
        if (frownIndex !== undefined) influences[frownIndex] = 0;
        break;
    }

  }, [scene, expression]); // `expression`が変わるたびにこの処理が実行される
  // --- ▲▲▲ 表情ロジックここまで ▲▲▲ ---


  // --- ▼▼▼ 既存の座るポーズのロジック（変更なし） ▼▼▼ ---
  useEffect(() => {
    if (!scene) return;
    scene.traverse((object: any) => {
      if (object instanceof THREE.Bone) {
        if (object.name === 'Spine1') { 
          object.rotation.x = 0.4; 
        }
        if (object.name === 'RightUpperLeg' || object.name === 'LeftUpperLeg') {
          object.rotation.x = -Math.PI / 2; 
        }
        if (object.name === 'RightLowerLeg' || object.name === 'LeftLowerLeg') {
          object.rotation.x = Math.PI / 2; 
        }
      }
    });
  }, [scene]); 
  // --- ▲▲▲ ポーズロジックここまで ▲▲▲ ---

  return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload(MODEL_PATH);