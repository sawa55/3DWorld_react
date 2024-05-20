import { useEffect, useState } from 'react';
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

        loader.load('./Model/Light_bake_test.glb', (cardGltf) => {
            setCardGltf(cardGltf);
            checkAllLoaded();
        });

        loader.load('./Model/Light_bake_3D.glb', (cardGltf_a) => {
            setCardGltf_a(cardGltf_a);
            checkAllLoaded();
        });
    }, [setGltf, setCardGltf, setCardGltf_a, onLoaded]);

    return null;
}

export default Loader;