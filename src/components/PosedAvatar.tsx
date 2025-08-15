'use client';

import { useGLTF, useAnimations } from '@react-three/drei';
import React, { useRef, useEffect, JSX } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const MODEL_PATH = 'https://models.readyplayer.me/689da2507c6c17df66c8f4a1.glb';

type PosedAvatarProps = JSX.IntrinsicElements['group'] & {
  expression: 'neutral' | 'talking' | 'thinking';
};

export function PosedAvatar({ expression, ...props }: PosedAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  
  // useFrameフック：毎フレーム実行される関数を登録します。アニメーションに最適です。
  useFrame(() => {
    const mesh = scene.getObjectByName('Wolf3D_Teeth') as THREE.SkinnedMesh;
    if (!mesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;

    const influences = mesh.morphTargetInfluences;
    const dict = mesh.morphTargetDictionary;
    const mouthOpenIndex = dict['mouthOpen'];
    const smileIndex = dict['mouthSmile'];

    // 目標の表情値を設定
    let targetMouth = 0;
    let targetSmile = 0;

    switch (expression) {
      case 'talking':
        // 口をパクパクさせるために、時間に応じて値を変化させる
        targetMouth = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        break;
      case 'thinking':
        targetSmile = 0.5;
        break;
      default: // 'neutral'
        break;
    }

    // 現在の表情値から目標値へ、滑らかに変化させる（Lerp）
    if (mouthOpenIndex !== undefined) {
      influences[mouthOpenIndex] = THREE.MathUtils.lerp(influences[mouthOpenIndex], targetMouth, 0.1);
    }
    if (smileIndex !== undefined) {
      influences[smileIndex] = THREE.MathUtils.lerp(influences[smileIndex], targetSmile, 0.1);
    }
  });

  // 座るポーズの設定（これは初回だけでOK）
  useEffect(() => {
    scene.traverse((object: any) => {
      if (object instanceof THREE.Bone) {
        if (object.name === 'Spine1') object.rotation.x = 0.4;
        if (object.name === 'RightUpperLeg' || object.name === 'LeftUpperLeg') object.rotation.x = -Math.PI / 2;
        if (object.name === 'RightLowerLeg' || object.name === 'LeftLowerLeg') object.rotation.x = Math.PI / 2;
      }
    });
  }, [scene]);

  return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload(MODEL_PATH);
