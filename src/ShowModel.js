import React, { useEffect, useState } from 'react';
import { useGlobalId, usePortalClicked } from './ActiveContext';

const ShowModel = ({ gltf, cardGltf, cardGltf_a }) => {
    const { globalId } = useGlobalId();
    const { setisPortalClicked } = usePortalClicked();


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


    const handleTest = () => {
        console.log("test");
        setisPortalClicked(false);
    };




    return (
        <primitive object={selectedModel.scene} onPointerDown={handleTest} />
    );
};


export default React.memo(ShowModel);