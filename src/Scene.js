import {
  useGLTF,
  MeshPortalMaterial,
  RoundedBox,
  Cone,
  Tetrahedron
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useActive, useGlobalId } from './ActiveContext';
import * as TWEEN from '@tweenjs/tween.js';

const Scene = ({ position, model, id }) => {
  console.log('Scene rendered');
  const [Card_active, setActive] = useState(false);
  const meshPortalMaterialRef = useRef();
  const [localHovered, setLocalHovered] = useState(false); // ローカルの hovered 状態を保持
  const { isActive,
    setIsHovered,
    isAnimating, setIsAnimating,

  } = useActive();
  const { globalId, setGlobalId } = useGlobalId();
  const blendTweenRef = useRef(null);
  const blendTargetRef = useRef(0);

  // groupのpositionを逆転させる
  const inversePosition = position.map(coord => -coord);

  useFrame((_, delta) => {
    TWEEN.update();

    // アニメーションの条件をフック内でチェック
    if (!blendTweenRef.current || blendTargetRef.current !== (Card_active ? 1 : 0)) {
      blendTargetRef.current = Card_active ? 1 : 0;
      if (blendTweenRef.current) blendTweenRef.current.stop();

      setIsAnimating(true); // アニメーション開始
      blendTweenRef.current = new TWEEN.Tween(meshPortalMaterialRef.current)
        .to({ blend: blendTargetRef.current }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          setIsAnimating(false); // アニメーション完了時に状態を更新
        })
        .start();
    }
  });

  const doubleClickHandler = (event) => {
    if (!isAnimating && isActive) { // アニメーションが進行中でなければクリックを受け付ける
      setActive(!Card_active);
      if (globalId === id) {
        setGlobalId(null); // globalIdが現在のidと同じ場合はnullに設定
      } else {
        setGlobalId(id); // それ以外の場合はidを設定
      }

    }
    event.stopPropagation();
  };

  if (!model || !model.scene) {
    return <div>Loading...</div>;
  }

  const handlePointerOver = (event) => {

    setIsHovered(true);
    setLocalHovered(true);

    event.stopPropagation(); // 他のオブジェクトへのイベント伝播を停止
  };

  const handlePointerOut = () => {

    setIsHovered(false);
    setLocalHovered(false);

  };

  useEffect(() => {
    if (globalId === null) {
      setActive(false);  // globalIdがnullの場合、Card_activeをfalseに設定
    } else if (globalId === id) {
      setActive(true);
    } else if (globalId !== id) {
      setActive(false);
    }
  }, [globalId]);




  return (
    <>
      <group position={position}>
        <Tetrahedron args={localHovered ? [0.12, 0] : [0.1, 0]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="royalblue" />
        </Tetrahedron>

        <RoundedBox
          args={[0.6, 0.6, 0.01]}
          radius={0.01}
          onClick={doubleClickHandler}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <MeshPortalMaterial ref={meshPortalMaterialRef}>
            <primitive object={model.scene} scale={1} position={[...inversePosition, 0.6]} />

            <mesh>
              <meshBasicMaterial side={THREE.BackSide} />
            </mesh>
          </MeshPortalMaterial>
        </RoundedBox>
      </group>
    </>
  );
};

export default Scene;