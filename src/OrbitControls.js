import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { useActive } from './ActiveContext';

export function SetupOrbitControls(camera, domElement) {
    console.log('SetupOrbitControls');
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -1;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: null,
        RIGHT: THREE.MOUSE.ROTATE
    };

    // カメラの前方にターゲットを設定
    const frontVector = new THREE.Vector3(0, 0, -0.1); // カメラの前方向
    frontVector.applyQuaternion(camera.quaternion); // カメラの回転を適用
    frontVector.multiplyScalar(0.1); // 前方10ユニットの位置
    frontVector.y = 0;
    controls.target.addVectors(camera.position, frontVector); // カメラの位置に加算

    controls.update(); // コントロールを更新



    return controls;
}
