'use client'; 
// Next.js App Router 環境でクライアントサイドで実行されるコンポーネントであることを指定

import { useFrame, useLoader } from '@react-three/fiber';
// react-three-fiber から、毎フレーム処理用の useFrame と 3Dモデル読込用の useLoader をインポート

import React, { JSX, useEffect, useMemo } from 'react';
// React 本体と型、フック（useEffect, useMemo）をインポート

import * as THREE from 'three';
// three.js の全機能をインポート（補助的に利用するため）

import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
// pixiv 提供の three-vrm ライブラリから VRM 読み込み用プラグインとユーティリティをインポート

import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// three.js の GLTF ローダーをインポート（VRMファイルはGLTFベースなのでこれを利用する）


type VrmAvatarProps = JSX.IntrinsicElements['group'] & {
  vrmUrl: string; // VRMファイルのURL
  expression: 'neutral' | 'happy' | 'angry' | 'sad' | 'relaxed'; // 表情の種類を指定
};
// VrmAvatar コンポーネントに渡す props の型定義


export function VrmAvatar({ vrmUrl, expression, ...props }: VrmAvatarProps) {
  // VrmAvatar コンポーネントの定義（VRMモデルを読み込んで表示＋表情制御する）

  const gltf = useLoader(GLTFLoader, vrmUrl, (loader) => {
    // GLTFLoader で VRMファイルを読み込み
    loader.register((parser:any) => new VRMLoaderPlugin(parser));
    // VRMLoaderPlugin を GLTFLoader に登録（VRM形式を解釈できるようにする）
  });

  const vrm = useMemo(() => gltf.userData.vrm, [gltf]);
  // gltf の userData に格納されている VRM オブジェクトを取得
  // useMemo でキャッシュして無駄な再計算を防ぐ

  useEffect(() => {
    if (vrm) {
      VRMUtils.rotateVRM0(vrm);
      // VRM0形式の場合、正しい回転に修正する（Tポーズが正しい向きになるようにする）
    }
  }, [vrm]);
  // VRM 読み込み直後に一度だけ回転を補正する


  useFrame((state, delta) => {
    // 毎フレーム実行される処理（アニメーション制御用）

    if (!vrm?.expressionManager) return;
    // VRM が存在しない、または表情管理ができない場合は何もしない

    // ▼▼▼ この1行を削除 ▼▼▼
    // vrm.expressionManager.resetMorphTarget(); // 存在しない関数なので削除

    // 指定された表情を 100% の強さで適用
    vrm.expressionManager.setValue(expression, 1.0);
    
    // 瞬きのアニメーション（サイン波を使って自然なまばたきっぽくする）
    const blink = 0.5 * (1.0 + Math.sin(state.clock.elapsedTime * Math.PI));
    vrm.expressionManager.setValue('blink', blink);

    // 表情の変化を反映させる
    vrm.expressionManager.update(delta);
    
    // VRMモデル全体を更新（ボーンや表情の状態を反映）
    vrm.update(delta);

  });

  return <primitive object={gltf.scene} {...props} />;
  // 読み込んだ GLTF シーンを React コンポーネントとして表示
}
