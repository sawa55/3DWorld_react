import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from "./Loader";
import HighlightMarker from "./Mark";
import Portal from "./Portal";
import Text from "./Text";
import ShowModel from "./ShowModel";

function App() {
    const [gltf, setGltf] = useState(null);
    const [cardGltf, setCardGltf] = useState(null);
    const [cardGltf_a, setCardGltf_a] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="app-container">
            <Text />
            <div id="canvas">
                <Canvas camera={{ position: [0, 0.3, 0], fov: 75 }}>
                    <Loader setGltf={setGltf} setCardGltf={setCardGltf} setCardGltf_a={setCardGltf_a} onLoaded={setIsLoaded} />
                    {isLoaded && (
                        <>
                            <ShowModel
                                gltf={gltf}
                                cardGltf={cardGltf}
                                cardGltf_a={cardGltf_a}
                            />
                            <HighlightMarker gltf={gltf} />
                            <Portal position={[0.2, 0, -0.5]} model={cardGltf} id={"a"} />
                            <Portal position={[-0.4, 0, -0.8]} model={cardGltf_a} id={"b"} />
                        </>
                    )}
                </Canvas>
            </div>
        </div>
    );
}

export default App;