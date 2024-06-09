import {

  RoundedBox,

  Tetrahedron,
  Edges,
  Text3D,
  shaderMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber"
import { useActive, useGlobalId, usePortalClicked } from './ActiveContext';
import { gsap } from 'gsap';




const CustomShaderMaterial = shaderMaterial(
  // Uniforms
  {
    color: new THREE.Color(0x00ffff),
    time: 0,

    uAnimation: { value: 0 } // アニメーションの進行状況を示すユニフォーム（0から1）
  },
  // Vertex Shader
  `uniform float time;
 uniform float uAnimation;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // 中心からの距離を計算
    float distance = length(modelPosition.xy);


   
      modelPosition.z += sin(distance * 10.0 - time * 2.0) * 0.05 *uAnimation;
    

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
  }`,
  // Fragment Shader
  `uniform vec3 color;
  void main() {
    gl_FragColor = vec4(color, 1.0);
  }`
);
extend({ CustomShaderMaterial });


function AnimationEffect(material, targetValue) {
  if (material && material.uniforms && material.uniforms.uAnimation) {
    gsap.to(material.uniforms.uAnimation, {
      value: targetValue,
      duration: 2,
      ease: 'power2',
      repeat: 0,  // 繰り返しを無効化
      yoyo: false  // yoyoを無効化
    });
  } else {
    console.error('AnimationEffect cannot access material uniforms');
  }
}
const PortalMaterialImpl = ({ position, model, id }) => {
  ('portalMaterialImpl rendered');
  const [Card_active, setActive] = useState(false);
  const tetraRef = useRef();

  const [localHovered, setLocalHovered] = useState(false); // ローカルの hovered 状態を保持
  const { isActive,
    setIsHovered,
    isMobile
  } = useActive();
  const { globalId, setGlobalId } = useGlobalId();
  const { setisPortalClicked } = usePortalClicked();

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
      const distance = camera.position.x - position[0];
      const offset = Math.sign(distance) * Math.min(maxOffset, Math.abs(distance * .8));
      textRef.current.position.x = initialPosition.x + offset;
      textRef.current.geometry.center();
      textRef.current.lookAt(camera.position);

    }
  });

  const shaderRef = useRef();

  useFrame(({ clock }) => {

    shaderRef.current.uniforms.time.value = clock.getElapsedTime();


  });
  useEffect(() => {
    if (localHovered) {
      AnimationEffect(shaderRef.current, 1);
    } else {
      AnimationEffect(shaderRef.current, 0);
    }
  }, [localHovered]);

  const inversePosition = position.map(coord => -coord);

  const doubleClickHandler = (event) => {

    if (isActive) {
      if (globalId === id) {
        setGlobalId(null);
      } else {
        setGlobalId(id);
      }

    }
    event.stopPropagation();
  };



  const handlePointerOver = (event) => {

    setIsHovered(true);
    setLocalHovered(true);

    event.stopPropagation();
    // 他のオブジェクトへのイベント伝播を停止
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setLocalHovered(false);

  };

  // ここで関数を定義
  const portalTouchStart = (evnet) => {
    setisPortalClicked(true);
    setIsHovered(true);
    setLocalHovered(true);
  };
  const portalTouchEnd = () => {
    setIsHovered(false);
    setLocalHovered(false);
  }

  // useEffect(() => {
  //   // イベントリスナーを登録
  //   window.addEventListener('touchstart', portalTouchStart);
  //   window.addEventListener('touchend', portalTouchEnd);

  //   // コンポーネントのクリーンアップ時にイベントリスナーを削除
  //   return () => {
  //     window.removeEventListener('touchstart', portalTouchStart);
  //     window.removeEventListener('touchend', portalTouchEnd);
  //   };
  // }, []); // 空の依存配列を指定して、マウント時とアンマウント時にのみ実行されるようにする





  const geometry = new THREE.BoxGeometry(1, 0.4, 0.01, 10, 5, 1);




  return (
    <>
      <group position={position}>
        <Tetrahedron
          ref={tetraRef}
          args={localHovered ? [0.2, 0] : [0.1, 0]}
          position={localHovered ? [0, 0.6, 0] : [0, 0.4, 0]}

        >
          <meshBasicMaterial color={localHovered ? "red" : "royalblue"} />
        </Tetrahedron>

        <mesh
          // args={[0.6, 0.6, 0.01]}
          // radius={0.01}
          geometry={geometry}
          onPointerDown={!isMobile ? undefined : portalTouchStart}
          onPointerUp={!isMobile ? undefined : portalTouchEnd}

          onClick={
            // !isMobile ? 
            doubleClickHandler
            //  : undefined
          }

          onPointerOver={!isMobile ? handlePointerOver : undefined}
          onPointerOut={!isMobile ? handlePointerOut : undefined}
        >

          <customShaderMaterial ref={shaderRef} />
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
