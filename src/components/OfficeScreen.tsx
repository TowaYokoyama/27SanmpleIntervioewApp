import React from 'react'
import { useGLTF } from '@react-three/drei'

export function OfficeScene() {
  // publicフォルダに置いたファイル名を指定
  const { scene } = useGLTF('/office.glb') 
  return <primitive object={scene} />
}

// モデルを事前読み込み
useGLTF.preload('/office.glb')