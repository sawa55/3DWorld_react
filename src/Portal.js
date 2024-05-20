import {

  RoundedBox,

  Tetrahedron
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";

import { useActive, useGlobalId } from './ActiveContext';


const portalMaterialImpl = ({ position, model, id }) => {
  console.log('portalMaterialImpl rendered');
  const [Card_active, setActive] = useState(false);

  const [localHovered, setLocalHovered] = useState(false); // ローカルの hovered 状態を保持
  const { isActive,
    setIsHovered,
    isAnimating,

  } = useActive();
  const { globalId, setGlobalId } = useGlobalId();



  const inversePosition = position.map(coord => -coord);

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

        </RoundedBox>
      </group>
    </>
  );
};

export default portalMaterialImpl;
