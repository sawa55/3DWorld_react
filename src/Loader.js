import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Loader({ setGltf, setCardGltf, setCardGltf_a }) {
    console.log('Loader rendered');
    useEffect(() => {
        const loader = new GLTFLoader();

        // 既存のモデルを読み込む
        loader.load('./Model/Light_bake_test.glb', (gltf) => {
            setGltf(gltf);
        });

        // 新しいモデルを Card_gltf として読み込む
        loader.load('./Model/DNA_5.glb', (cardGltf) => {
            setCardGltf(cardGltf);
        });

        loader.load('./Model/Eath.glb', (cardGltf_a) => {
            setCardGltf_a(cardGltf_a);
        });


    }, [setGltf, setCardGltf]);  // 依存配列に setCardGltf を追加

    return null;
}

export default Loader;