import React, { useEffect, useState } from 'react';
import { useGlobalId } from './ActiveContext';

const ShowModel = ({ gltf, cardGltf, cardGltf_a }) => {
    const { globalId } = useGlobalId();


    let selectedModel;
    switch (globalId) {

        case 'a':
            selectedModel = cardGltf;
            break;
        case 'b':
            selectedModel = cardGltf_a;
            break;
        default:
            selectedModel = gltf;
    }



    return (
        <primitive object={selectedModel.scene} />
    );
};


export default React.memo(ShowModel);