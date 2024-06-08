import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useGlobalId, useHover } from './ActiveContext';
import Youtube from './Youtube';
import Test from './Test';


const Text = () => {

    const { globalId, setGlobalId, } = useGlobalId();
    const { setIsHoveredJsx } = useHover();
    console.log(globalId);
    const handleEvent = (event) => {
        event.stopPropagation();
        // イベントの伝播を停止
        event.preventDefault();
    };

    const handleSwitchId = () => {
        if (globalId === 'a') {
            setGlobalId('b');
        } else if (globalId === 'b') {
            setGlobalId('a');
        }
    };

    const handleButtonClick = () => {
        setGlobalId(null);
    };

    const textMouseEnter = () => {
        setIsHoveredJsx(true);
        console.log('hovered');
    }
    const textMouseLeave = () => {
        setIsHoveredJsx(false);
    }


    return (
        <main
            className={`text_main ${globalId ? 'visible' : 'hidden'}`}
            onClick={handleEvent}
            onMouseEnter={textMouseEnter}
            onMouseLeave={textMouseLeave}
        >
            <button className='reset' onClick={handleButtonClick}>×</button>

            <div className={`text ${globalId ? 'visible' : 'hidden'}`}>
                <div className={`text_container 
            ${globalId === 'a' ? 'true' : 'false'} 
            ${globalId ? 'Show' : 'hidden'}`}>

                    <pre>
                        <section>
                            <div className="main_header">実績</div>
                            <div className="content">
                                <div>株式会社アド電通大阪WEBサイト制作<p>(Three.jsの実装とモデリングを担当)</p></div>
                            </div>
                        </section>
                        <section>
                            <div className="main_header">使用可能言語<p>フレームワーク</p></div>
                            <div className="content">
                                <ul>
                                    <li>JavaScript</li>
                                    <li>React.js</li>
                                    <li>Three.js</li>
                                    <li>A-Frame</li>
                                    <li>Node.js</li>
                                    <li>Python</li>
                                    <li>VBA</li>
                                </ul>
                            </div>
                            <div className="header">使用経験言語<p>フレームワーク</p></div>
                            <div className="content">
                                <ul>
                                    <li>TypeScript</li>
                                    <li>Vue.js</li>
                                    <li>PHP</li>
                                    <li>C#</li>
                                </ul>
                            </div>
                            <div className="header">管理ツール</div>
                            <div className="content">
                                <ul>
                                    <li>Git</li>
                                    <li>GitHub</li>
                                    <li>Backlog</li>
                                    <li>Docker</li>
                                </ul>
                            </div>
                        </section>
                    </pre>
                    <button onClick={handleSwitchId}>'3DCGについて'</button>
                </div>
                <div className={`text_container 
            ${globalId === 'b' ? 'true' : 'false'}
            ${globalId ? 'Show' : 'hidden'}`}>


                    <pre>
                        <section>
                            <div className="main_header">実績</div>
                            <div className="content">
                                <div>日産自動車株式会社(CG協力)</div>
                                <Youtube />

                                <div>フジテレビ 呼び出し先生タナカ(CG制作)</div>
                            </div>
                        </section>
                        <section>
                            <div className="main_header">使用ソフト</div>
                            <div className="content">
                                <div className="header">映像ツール</div>
                                <div className="content">
                                    <ul>
                                        <li>Blender</li>
                                        <li>Unreal Engine</li>
                                        <li>Davinci Resolve</li>
                                    </ul>
                                </div>
                                <div className="header">デザインツール</div>
                                <div className="content">
                                    <ul>
                                        <li>Canva</li>
                                        <li>Figma</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </pre>
                    <button onClick={handleSwitchId}>プログラミングについて</button>
                </div>
            </div>
        </main>

    );
};

export default React.memo(Text);