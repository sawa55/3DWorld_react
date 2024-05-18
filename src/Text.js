import React, { useEffect, useState } from 'react';
import { useGlobalId } from './ActiveContext';

const Text = () => {
    console.log('Text rendered')
    const { globalId, setGlobalId, } = useGlobalId();
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

    const handleSwitchId = () => {
        if (globalId === 'a') {
            setGlobalId('b');
        } else if (globalId === 'b') {
            setGlobalId('a');
        }
    };

    const handleButtonClick = () => {
        setGlobalId(null);  // globalIdをnullに設定
    };

    return (
        <div className={`text ${showText ? 'visible' : 'hidden'}`}
            onClick={handleEvent}

        >
            {getTextContent(globalId)}
            <button onClick={handleButtonClick}>Reset Global ID</button>
            <p>Current Global ID: {globalId}</p>
            <button onClick={handleSwitchId}>Switch ID</button>
        </div>
    );
};

export default React.memo(Text);