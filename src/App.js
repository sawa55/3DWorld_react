import React, { useState, useRef } from 'react';
import { Canvas, } from '@react-three/fiber';
import Loader from "./Loader";
import HighlightMarker from "./Mark";
import Scene from "./Scene";
import Text from "./Text";
import Keyboard from './keyboard';



function App() {
    const [gltf, setGltf] = useState(null);
    const [cardGltf, setCardGltf] = useState(null);
    const [cardGltf_a, setCardGltf_a] = useState(null);

    console.log('App rendered');



    return (
        <div className="app-container">
            <Text />
            <div id="canvas">
                <Canvas camera={{ position: [0, 0.3, 0], fov: 75 }}>
                    <Loader setGltf={setGltf} setCardGltf={setCardGltf} setCardGltf_a={setCardGltf_a} />
                    {gltf && cardGltf && (
                        <>
                            <primitive object={gltf.scene} />
                            <HighlightMarker gltf={gltf} />
                            <Scene position={[0.2, 0, -0.5]} model={cardGltf} id={"a"} />
                            {/* <Scene position={[-0.4, 0, -0.7]} model={cardGltf_a} id={"b"} /> */}
                        </>
                    )}
                    {/* <Keyboard /> */}
                </Canvas>
            </div>
        </div>
    );
}

export default App;