import React, { useRef, useState, useEffect, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Circle } from '@react-three/drei';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { SetupOrbitControls } from './OrbitControls';
import { useActive, useHover, usePortalClicked } from './ActiveContext';



function HighlightMarker({ gltf }) {
    ('HighlightMarker rendered');
    const [markerPosition, setMarkerPosition] = useState([0, 0, 0]);
    const [touchStart, setTouchStart] = useState(false);
    const [visible, setVisible] = useState(false);
    const { raycaster, pointer, camera, gl, scene } = useThree();
    const controls = useRef();
    const { isActive, isHovered, isMobile } = useActive();
    const isAnimating = useRef(false);
    const { isHoveredJsx, setIsHoveredJsx } = useHover();
    const { isPortalClicked } = usePortalClicked();

    //*カメラが動くかどうかを決めている
    useEffect(() => {
        controls.current = SetupOrbitControls(camera, gl.domElement);

        return () => {
            if (controls.current) {
                controls.current.dispose();
            }
        };
    }, [camera, gl.domElement]);

    useEffect(() => {
        const handleTouchStart = () => {
            setTouchStart(true);
        };

        if (isMobile) {
            window.addEventListener('touchstart', handleTouchStart);
            return () => {
                window.removeEventListener('touchstart', handleTouchStart);
            };
        }
    }, [touchStart]);

    useEffect(() => {
        const hadleTouchEnd = () => {
            setTouchStart(false);
        };
        if (isMobile) {
            window.addEventListener('touchend', hadleTouchEnd);
            return () => {
                window.removeEventListener('touchend', hadleTouchEnd);
            };
        }
    }, [touchStart]);



    //*マーカーを出すかどうかを決めている
    useEffect(() => {
        if (isMobile) {
            const handleTouchMove = (event) => {
                // タッチイベントの座標を取得
                const touch = event.touches[0];
                const x = (touch.clientX / window.innerWidth) * 2 - 1;
                const y = -(touch.clientY / window.innerHeight) * 2 + 1;

                // pointerを更新
                pointer.set(x, y);

                // raycasterを更新
                raycaster.setFromCamera(pointer, camera);

                // オブジェクトとの交差点を計算
                const intersects = raycaster.intersectObjects(gltf.scene.children, true);
                const boxIntersect = intersects.find(intersect => intersect.object.name === "Floor");
                console.log(isHoveredJsx);
                if (boxIntersect && !isHoveredJsx) {
                    const position = boxIntersect.point.clone();
                    position.y += 0.01; // 少し浮かせる
                    setMarkerPosition(position.toArray());
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            };

            // イベントリスナーを追加
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchstart', handleTouchMove);

            // クリーンアップ関数
            return () => {
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchstart', handleTouchMove);
            };

        } else {
            const Intersect = () => {
                if (gltf && !isHovered) {
                    raycaster.setFromCamera(pointer, camera);
                    const intersects = raycaster.intersectObjects(gltf.scene.children, true);
                    const boxIntersect = intersects.find(intersect => intersect.object.name === "Floor");
                    if (boxIntersect && !isHoveredJsx) {
                        const position = boxIntersect.point.clone();
                        position.y += 0.01;
                        setMarkerPosition(position.toArray());
                        setVisible(true);
                    } else {
                        setVisible(false);
                    }
                }
            };

            window.addEventListener('mousemove', Intersect);

            return () => {
                window.removeEventListener('mousemove', Intersect);
            };
        }
    }, [gltf, isHovered, raycaster, pointer, camera,
        isHoveredJsx, visible, isActive, isHovered, isHoveredJsx, touchStart]);


    //*動くかどうかを決めている
    useEffect(() => {

        if (isMobile) {
            document.addEventListener('touchend', handleMarkerClick);
        } else {
            document.addEventListener('mouseup', handleMarkerClick);
        }

        // クリーンアップ関数を追加
        return () => {
            if (isMobile) {
                document.removeEventListener('touchend', handleMarkerClick);
            } else {
                document.removeEventListener('mouseup', handleMarkerClick);
            }
        };
    }, [visible, isActive, isHovered, isHoveredJsx, touchStart, isPortalClicked]);




    useFrame(({ clock }) => {
        TWEEN.update();
    });

    const handleMarkerClick = () => {
        console.log(visible + "visible " + isActive + " isActive " + isHovered + " isHovered")
        if (isMobile) {
            if (visible && isActive && !isHovered && !isHoveredJsx && !isPortalClicked) {
                const targetPosition = new THREE.Vector3(...markerPosition);
                const startQuaternion = camera.quaternion.clone();
                isAnimating.current = true;

                new TWEEN.Tween(camera.position)
                    .to({
                        x: targetPosition.x,
                        y: 0.3,
                        z: targetPosition.z
                    }, 2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(() => {
                        if (controls.current) {
                            const newTarget = camera.position.clone();
                            const direction = new THREE.Vector3();
                            isAnimating.current = false;
                            camera.getWorldDirection(direction);
                            direction.multiplyScalar(0.01);
                            newTarget.add(direction);

                            controls.current.target.copy(newTarget);
                            controls.current.update();
                        }
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

        } else {
            if (visible && isActive && !isHovered) {
                const targetPosition = new THREE.Vector3(...markerPosition);
                const startQuaternion = camera.quaternion.clone();
                isAnimating.current = true;

                new TWEEN.Tween(camera.position)
                    .to({
                        x: targetPosition.x,
                        y: 0.3,
                        z: targetPosition.z
                    }, 2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(() => {
                        if (controls.current) {
                            const newTarget = camera.position.clone();
                            const direction = new THREE.Vector3();
                            isAnimating.current = false;
                            camera.getWorldDirection(direction);
                            direction.multiplyScalar(0.01);
                            newTarget.add(direction);

                            controls.current.target.copy(newTarget);
                            controls.current.update();
                        }
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
        }


    };

    return (
        <>
            {visible && !isHovered && (
                <Circle args={[0.2, 32]} position={markerPosition} rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshBasicMaterial color="white" transparent opacity={0.5} side={THREE.DoubleSide} />
                </Circle>
            )}
        </>
    );
}

export default HighlightMarker;
