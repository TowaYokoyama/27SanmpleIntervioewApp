'use client';

import { useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, JSX, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 新しいアバターのURL
const MODEL_PATH = 'https://models.readyplayer.me/689fbc6d19b4a3fa54e1e606.glb';

type PosedAvatarProps = JSX.IntrinsicElements['group'] & {
  expression: 'neutral' | 'talking' | 'thinking';
};

export function PosedAvatar({ expression, ...props }: PosedAvatarProps) {
  const { scene } = useGLTF(MODEL_PATH);
  
  // ▼▼▼ Stateの型定義を修正 ▼▼▼
  // useStateに、SkinnedMeshまたはnullが入ることを明示的に教える
  const [meshes, setMeshes] = useState<{ face: THREE.SkinnedMesh | null, teeth: THREE.SkinnedMesh | null }>({ face: null, teeth: null });

  // --- モデル読み込み時に一度だけ実行 ---
  useEffect(() => {
    if (!scene) return;
    
    // オブジェクトを探索し、顔と歯のメッシュを見つけてStateに保存
    const faceMesh = scene.getObjectByName('Wolf3D_Avatar') as THREE.SkinnedMesh | null;
    const teethMesh = scene.getObjectByName('Wolf3D_Teeth') as THREE.SkinnedMesh | null;
    setMeshes({ face: faceMesh, teeth: teethMesh });

    // 座るポーズの設定
    scene.traverse((object: any) => {
      if (object instanceof THREE.Bone) {
        if (object.name === 'Spine1') object.rotation.x = 0.4;
        if (object.name === 'RightUpperLeg' || object.name === 'LeftUpperLeg') object.rotation.x = -Math.PI / 2;
        if (object.name === 'RightLowerLeg' || object.name === 'LeftLowerLeg') object.rotation.x = Math.PI / 2;
      }
    });
  }, [scene]);

  
  // --- 表情アニメーション（毎フレーム実行） ---
  useFrame(() => {
    // 顔と歯のメッシュが見つかっていなければ何もしない
    if (!meshes.face || !meshes.teeth) return;

    const { face, teeth } = meshes;

    // 顔の表情を制御
    const faceInfluences = face.morphTargetInfluences;
    const faceDict = face.morphTargetDictionary;
    if (faceDict && faceInfluences) {
      const smileIndex = faceDict['mouthSmile'];
      
      let targetSmile = 0;
      if (expression === 'thinking') {
        targetSmile = 0.8; // 考え中は微笑む
      }
      if (smileIndex !== undefined) {
        faceInfluences[smileIndex] = THREE.MathUtils.lerp(faceInfluences[smileIndex], targetSmile, 0.1);
      }
    }

    // 歯（口の開閉）を制御
    const teethInfluences = teeth.morphTargetInfluences;
    const teethDict = teeth.morphTargetDictionary;
    if (teethDict && teethInfluences) {
      const mouthOpenIndex = teethDict['mouthOpen'];

      let targetMouth = 0;
      if (expression === 'talking') {
        // 口をパクパクさせる
        targetMouth = 0.4 + Math.sin(Date.now() * 0.01) * 0.3;
      }
      if (mouthOpenIndex !== undefined) {
        teethInfluences[mouthOpenIndex] = THREE.MathUtils.lerp(teethInfluences[mouthOpenIndex], targetMouth, 0.2);
      }
    }
  });

  return <primitive object={scene} {...props} />;
}

useGLTF.preload(MODEL_PATH);