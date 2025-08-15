'use client';

import { useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, JSX } from 'react';

import * as THREE from 'three';

const MODEL_PATH = 'https://models.readyplayer.me/689da2507c6c17df66c8f4a1.glb';

export function PosedAvatar(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((object:any) => {
      if (object instanceof THREE.Bone) {
        
        // --- 正しい骨の名前で、正しい角度に修正 ---

        // 上半身を少しだけ前に傾ける
        if (object.name === 'Spine1') { // "Spine" -> "Spine1" に変更
          object.rotation.x = 0.2; // 角度を調整
        }
        
        // 足の付け根を曲げて座らせる (Ready Player MeではUpperLeg)
        if (object.name === 'RightUpperLeg' || object.name === 'LeftUpperLeg') {
          object.rotation.x = -Math.PI / 2; // 逆さまなのでマイナスに変更
        }
        
        // 膝を曲げる (Ready Player MeではLowerLeg)
        if (object.name === 'RightLowerLeg' || object.name === 'LeftLowerLeg') {
          object.rotation.x = Math.PI / 2; // 角度を調整
        }
      }
    });
  }, [scene]);

  return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload(MODEL_PATH);