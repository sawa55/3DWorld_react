import React, { useEffect, useState, useContext } from 'react';
import { useActive } from './ActiveContext';

const Text = () => {
    const { globalId } = useActive();
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        if (globalId) {
            setShowText(true); // globalIdがある場合、テキストを表示
        } else {
            setShowText(false); // globalIdがない場合、テキストを非表示
        }
    }, [globalId]);

    const handleEvent = (event) => {
        event.stopPropagation(); // イベントの伝播を停止
        event.preventDefault();
        console.log('Text clicked');
    };


    // globalIdに基づいて表示するテキストを決定
    const getTextContent = (id) => {
        switch (id) {
            case 'a':
                return 'これはDNAのIDに対するテキストです。';
            case 'b':
                return 'これは地球のIDに対するテキストです。';

            default:
                return 'IDが選択されていません。';
        }
    };

    return (
        <div className={`text ${showText ? 'visible' : 'hidden'}`}
            onClick={handleEvent}

        >
            {getTextContent(globalId)}
        </div>
    );
};

export default Text;
