import {

  RoundedBox,

  Tetrahedron,
  Edges,
  Text3D,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber"
import { useActive, useGlobalId } from './ActiveContext';


const PortalMaterialImpl = ({ position, model, id }) => {
  console.log('portalMaterialImpl rendered');
  const [Card_active, setActive] = useState(false);
  const tetraRef = useRef();

  const [localHovered, setLocalHovered] = useState(false); // ローカルの hovered 状態を保持
  const { isActive,
    setIsHovered,
    isAnimating,

  } = useActive();
  const { globalId, setGlobalId } = useGlobalId();

  useFrame((state, delta) => {
    if (tetraRef.current) {
      tetraRef.current.rotation.y += Math.PI * delta; // 1秒間にπラジアン（半回転）を追加
    }
  });

  const textRef = useRef();
  const initialPosition = { x: 0, y: 0, z: 0 }; // テキストの初期位置
  const maxOffset = 0.25; // X軸に沿った最大の動き

  const { camera } = useThree();  // カメラオブジェクトを取得

  useFrame(() => {
    if (textRef.current) {
      const distance = camera.position.x - position[0]; // カメラとテキストのX座標の差
      const offset = Math.sign(distance) * Math.min(maxOffset, Math.abs(distance * .8)); // オフセットを計算し、上限を設ける // オフセットを計算し、上限を設ける
      textRef.current.position.x = initialPosition.x + offset; // 新しいX座標を設定
      textRef.current.geometry.center(); // テキストがカメラの位置を向くように設定
      textRef.current.lookAt(camera.position);

    }
  });



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
        <Tetrahedron
          ref={tetraRef}
          args={localHovered ? [0.2, 0] : [0.1, 0]}
          position={localHovered ? [0, 0.6, 0] : [0, 0.4, 0]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshBasicMaterial color={localHovered ? "red" : "royalblue"} />
        </Tetrahedron>

        <mesh
          // args={[0.6, 0.6, 0.01]}
          // radius={0.01}
          onClick={doubleClickHandler}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry
            args={[1, 0.4, 0.01]}
            radius={0.01}
          />
          <meshBasicMaterial color="#00FFFF" />
          <Edges scale={1.1} color={localHovered ? "yellow" : "black"} />
        </mesh>
        <Text3D
          ref={textRef}
          font="./Fonts/Roboto Black_Regular.json" // Three.js JSONフォントファイルのパス
          size={0.1} // フォントサイズ
          position={[0, 0, -0.16]}
          rotation={[0, Math.PI, 0]}
          height={0.1} // テキストの厚み
          curveSegments={12} // 曲線のセグメント数
          material={new THREE.MeshBasicMaterial({ color: '#FF7F50' })}


        >
          Click
        </Text3D>
      </group>
    </>
  );
};

export default PortalMaterialImpl;
