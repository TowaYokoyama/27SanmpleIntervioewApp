'use client'; // Next.js 13+ のクライアントコンポーネント宣言（サーバーではなくブラウザで実行）

// @react-three/drei の useGLTF を使って glTF/GLB モデルを読み込む
import { useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, JSX } from 'react';
import * as THREE from 'three';

// 読み込む 3D モデルの URL（Ready Player Me で生成されたアバター）
const MODEL_PATH = 'https://models.readyplayer.me/689da2507c6c17df66c8f4a1.glb';

// "PosedAvatar" コンポーネント
// 引数 props は Three.js の <group> 要素に渡せるすべてのプロパティを受け取る
export function PosedAvatar(props: JSX.IntrinsicElements['group']) {
  // group: Three.js の Group（オブジェクトのコンテナ）への参照を保持
  const group = useRef<THREE.Group>(null);

  // useGLTF でモデルを読み込み、scene に格納
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    // モデルがまだ読み込まれていなければ何もしない
    if (!scene) return;

    // scene.traverse でモデル内のすべてのオブジェクトを再帰的に探索
    scene.traverse((object: any) => {
      // オブジェクトが Three.js の Bone（骨）かどうかを判定
      if (object instanceof THREE.Bone) {

        // ここから「骨格のポーズ調整」処理

        // 上半身を少し前に傾ける
        if (object.name === 'Spine1') { 
          // "Spine" ではなく "Spine1" が正しい名前だったので修正
          object.rotation.x = 0.2; 
          // 0.2 ラジアン → 約 11.5度 前傾
        }
        
        // 太もも（足の付け根）を曲げて座らせるポーズに
        if (object.name === 'RightUpperLeg' || object.name === 'LeftUpperLeg') {
          object.rotation.x = -Math.PI / 2; 
          // -90度回転（マイナスは逆方向）
        }
        
        // 膝を曲げる（LowerLeg が膝下の骨）
        if (object.name === 'RightLowerLeg' || object.name === 'LeftLowerLeg') {
          object.rotation.x = Math.PI / 2; 
          // +90度回転
        }
      }
    });
  }, [scene]); 
  // scene が変わったときだけ実行（通常は初回だけ）

  // Three.js の primitive コンポーネントで生の Three.js オブジェクトを表示
  // group に参照を渡して props を spread（位置・回転など外から指定可能）
  return <primitive ref={group} object={scene} {...props} />;
}

// 事前にモデルを読み込んでキャッシュ（表示の遅延を減らす）
useGLTF.preload(MODEL_PATH);
