import React, { useRef, useState, useEffect, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Circle } from '@react-three/drei';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { SetupOrbitControls } from './OrbitControls';
import { useActive } from './ActiveContext';

function HighlightMarker({ gltf }) {
    ('HighlightMarker rendered');
    const [markerPosition, setMarkerPosition] = useState([0, 0, 0]);
    const [visible, setVisible] = useState(false);
    const { raycaster, pointer, camera, gl, scene } = useThree();
    const controls = useRef();
    const { isActive, isHovered, isAnimating } = useActive();


    useEffect(() => {
        controls.current = SetupOrbitControls(camera, gl.domElement);

        return () => {
            if (controls.current) {
                controls.current.dispose();
            }
        };
    }, [camera, gl.domElement]);





    useEffect(() => {
        const Intersect = () => {
            if (gltf && !isHovered) {
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(gltf.scene.children, true);
                const boxIntersect = intersects.find(intersect => intersect.object.name === "Floor");
                if (boxIntersect) {
                    const position = boxIntersect.point.clone();
                    position.y += 0.01;
                    setMarkerPosition(position.toArray());
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        };
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            window.addEventListener('touchmove', Intersect);
        } else {
            window.addEventListener('mousemove', Intersect);
        }


        return () => {
            if (isMobile) {
                window.removeEventListener('touchmove', Intersect);
            }
            else { window.removeEventListener('mousemove', Intersect); }

        };
    }, [gltf, isHovered, raycaster, pointer, camera]);

    useFrame(({ clock }) => {
        TWEEN.update();
    });

    const handleMarkerClick = () => {
        if (visible && isActive && !isHovered && !isAnimating) {
            const targetPosition = new THREE.Vector3(...markerPosition);
            const startQuaternion = camera.quaternion.clone();
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
    };

    return (
        <>
            {visible && !isHovered && (
                <Circle args={[0.2, 32]} position={markerPosition} rotation={[Math.PI / 2, 0, 0]} onClick={handleMarkerClick}>
                    <meshBasicMaterial color="white" transparent opacity={0.5} side={THREE.DoubleSide} />
                </Circle>
            )}
        </>
    );
}

export default HighlightMarker;
