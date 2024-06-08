import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const ActiveContext = createContext();

export const useActive = () => useContext(ActiveContext);

export const ActiveProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const isActiveRef = useRef(isActive);
    const moveCount = useRef(0);
    const touchCount = useRef(0);
    const [isHovered, setIsHovered] = useState(false);


    useEffect(() => {
        isActiveRef.current = isActive; // 更新 isActiveRef 以保持最新状态
    }, [isActive]); // 依赖于 isActive 的变化

    useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const handleMouseDown = () => {
            setIsActive(true);
            if (isMobile) {
                touchCount.current = 0;
            } else {
                moveCount.current = 0;
            }
        };

        const handleMouseMove = () => {
            moveCount.current += 1;
            touchCount.current += 1;
            if (isMobile) {
                if (touchCount.current >= 6) {
                    setIsActive(false);
                }
            } else {
                if (moveCount.current >= 6) {
                    setIsActive(false);
                }
            }
        };

        const handleTouchStart = handleMouseDown;
        const handleTouchMove = handleMouseMove;

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []); // 依赖数组为空，因此只在组件挂载时运行

    return (
        <ActiveContext.Provider value={{
            isActive,
            setIsActive,
            isHovered,
            setIsHovered,
        }}>
            {children}
        </ActiveContext.Provider>
    );
};

const GlobalIdContext = createContext();

export const useGlobalId = () => useContext(GlobalIdContext);

export const GlobalIdProvider = ({ children }) => {
    const [globalId, setGlobalId] = useState(null);

    return (
        <GlobalIdContext.Provider value={{ globalId, setGlobalId }}>
            {children}
        </GlobalIdContext.Provider>
    );
};

const TextHoveredContext = createContext();

export const useHover = () => useContext(TextHoveredContext);

export const UseHoveredProvider = ({ children }) => {
    const [isHoveredJsx, setIsHoveredJsx] = useState(false);

    return (
        <TextHoveredContext.Provider value={{ isHoveredJsx, setIsHoveredJsx }}>
            {children}
        </TextHoveredContext.Provider>
    );
};