import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Circle } from '@react-three/drei';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

function HighlightMarker({ gltf }) {
    const [markerPosition, setMarkerPosition] = useState([0, 0, 0]);
    const [visible, setVisible] = useState(false);
    const { raycaster, pointer, camera, gl, scene } = useThree();
    const controlsRef = useRef();

    useEffect(() => {
        controlsRef.current = new OrbitControls(camera, gl.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.1;
        controlsRef.current.enableZoom = false;
        controlsRef.current.enablePan = false;
        controlsRef.current.rotateSpeed = -1;
        controlsRef.current.minPolarAngle = Math.PI / 4;
        controlsRef.current.maxPolarAngle = Math.PI;
        controlsRef.current.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: THREE.MOUSE.ROTATE
        };
        return () => {
            controlsRef.current.dispose();
        };
    }, [camera, gl.domElement]);


    useFrame(({ clock }) => {
        TWEEN.update();

        if (gltf) {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(gltf.scene.children, true);
            const boxIntersect = intersects.find(intersect => intersect.object.name === "Cube");
            if (boxIntersect) {
                const normal = boxIntersect.face.normal.clone();
                const position = boxIntersect.point.clone();
                normal.transformDirection(boxIntersect.object.matrixWorld);
                position.add(normal.multiplyScalar(0.01)); // 法線方向に少し浮かせる

                setMarkerPosition(position.toArray());
                setVisible(true);
            } else {
                setVisible(false);
            }

        }
    });

    const [isActive, setIsActive] = useState(false);
    const [moveCount, setMoveCount] = useState(0);



    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'a') {
                // 'A' キー: レンダリングを停止


            } else if (event.key === 'c') {
                // 'B' キー: group の位置をコンソールに出力
                console.log(camera.position);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);




    useEffect(() => {

        const handleMouseDown = () => {
            setIsActive(true);
            setMoveCount(0); // マウスダウン時にカウントをリセット
        };

        const handleMouseMove = () => {
            setMoveCount(prevCount => prevCount + 1);
        };

        const handleMouseUp = () => {
            setIsActive(false);
            setMoveCount(0); // マウスアップ時にカウントをリセット
        };

        // イベントリスナーを登録
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // クリーンアップ関数
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (moveCount >= 6) {
            setIsActive(false);
        }
    }, [moveCount]);



    const handleMarkerClick = () => {
        if (visible && isActive) {
            const targetPosition = new THREE.Vector3(...markerPosition);
            const startQuaternion = camera.quaternion.clone();
            new TWEEN.Tween(camera.position)
                .to({
                    x: targetPosition.x,
                    y: 0.3,
                    z: targetPosition.z
                }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                // .onUpdate(() => camera.lookAt(targetPosition))
                .onComplete(() => {
                    const newTarget = camera.position.clone();
                    const direction = new THREE.Vector3(); // 新しいベクトルを作成
                    camera.getWorldDirection(direction); // カメラの前方向を取得
                    direction.multiplyScalar(0.01); // 方向ベクトルを 0.01 でスケーリング
                    newTarget.add(direction); // 新しいターゲット位置に加算

                    controlsRef.current.target.copy(newTarget);
                    controlsRef.current.update();
                })
                .start();

            new TWEEN.Tween({ t: 0 })
                .to({ t: 1 }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(({ t }) => {
                    camera.quaternion.slerpQuaternions(startQuaternion, camera.quaternion, t);
                })
                .start();


        }
    };

    return (
        <>
            {visible && (
                <Circle args={[0.2, 32]} position={markerPosition} rotation={[Math.PI / 2, 0, 0]} onClick={handleMarkerClick}>
                    <meshBasicMaterial color="white" transparent opacity={0.5} side={THREE.DoubleSide} />
                </Circle>
            )}
        </>
    );
}

export default HighlightMarker;