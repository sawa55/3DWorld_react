import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Loader({ setGltf, setCardGltf, setCardGltf_a, onLoaded }) {
    useEffect(() => {
        const loader = new GLTFLoader();
        let loadCount = 0;

        const checkAllLoaded = () => {
            loadCount++;
            if (loadCount === 3) {
                onLoaded(true);
            }
        };

        loader.load('./Model/Light_bake_Chara.glb', (gltf) => {
            setGltf(gltf);
            checkAllLoaded();
        });

        loader.load('./Model/Light_bake_Laptop.glb', (cardGltf) => {
            setCardGltf(cardGltf);
            const video2 = document.getElementById('video2');
            video2.play();
            const texture = new THREE.VideoTexture(video2);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            texture.wrapS = THREE.RepeatWrapping;  // テクスチャのラッピングを設定
            texture.repeat.x = -1;  // テクスチャを水平に反転

            const Display = cardGltf.scene.children.find(child => child.name === 'Display');
            console.log(Display);
            if (Display) {
                // MeshBasicMaterialを使用してマテリアルを作成
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,  // 必要に応じて透明度を設定
                    opacity: 0.9        // 透明度の値
                });
                Display.material = material;
                Display.material.needsUpdate = true;

                // Planeの上下を反転
            }
            checkAllLoaded();
        });

        loader.load('./Model/Light_bake_3D.glb', (cardGltf_a) => {
            setCardGltf_a(cardGltf_a);

            const video = document.getElementById('video');
            video.play();
            const texture = new THREE.VideoTexture(video);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            texture.wrapS = THREE.RepeatWrapping;  // テクスチャのラッピングを設定
            texture.repeat.x = -1;  // テクスチャを水平に反転

            const plane = cardGltf_a.scene.children.find(child => child.name === 'Plane');
            console.log(plane);
            if (plane) {
                // MeshBasicMaterialを使用してマテリアルを作成
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,  // 必要に応じて透明度を設定
                    opacity: 0.9        // 透明度の値
                });
                plane.material = material;
                plane.material.needsUpdate = true;

                // Planeの上下を反転
                plane.scale.z = -2;
            }

            checkAllLoaded();
        });
    }, [setGltf, setCardGltf, setCardGltf_a, onLoaded]);

    return null;
}

export default Loader;