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
                return `使用可能言語
    HTML,CSS
    JavaScript
    React.js
    Three.js
    Node.js
    
バージョン管理ツール
    Git, GitHub
    Backlog`;

            case 'b':
                return `使用ソフト

  映像ツール

    Blender
    Unreal Engine
    Davinci Resolve
    
  デザインツール

    Canva
    Figma`;

            default:
                return 'IDが選択されていません。';
        }
    };

    const getTextContent2 = (id) => {
        switch (id) {
            case 'a':
                return '3DCGについて';
            case 'b':
                return 'プログラミングについて';
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
            <pre>{getTextContent(globalId)}</pre>
            <button className='reset' onClick={handleButtonClick}>×</button>
            {/* <p>Current Global ID: {globalId}</p> */}
            <button onClick={handleSwitchId}>{getTextContent2(globalId)}</button>
        </div>
    );
};

export default React.memo(Text);