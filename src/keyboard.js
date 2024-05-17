import React, { useEffect } from 'react';
import { useActive } from './ActiveContext';


function Keyboard() {
    const {
        isActive,
        isHovered,
        hoveredId,
        isAnimating,
        globalId
    } = useActive();


    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'i') {
                // コンテキストからすべての変数を取得してコンソールに出力
                console.log({
                    isActive: isActive,
                    isHovered: isHovered,
                    hoveredId: hoveredId,
                    isAnimating: isAnimating,
                    globalId: globalId
                });
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isActive, isHovered, hoveredId, isAnimating, globalId]); // 依存配列にコンテキストの変数を追加
}
export default Keyboard;