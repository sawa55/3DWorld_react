import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const ActiveContext = createContext();

export const useActive = () => useContext(ActiveContext);

export const ActiveProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const moveCount = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const handleMouseDown = () => {
            setIsActive(true);
            moveCount.current = 0;
        };

        const handleMouseMove = () => {
            moveCount.current += 1;
            if (moveCount.current >= 6) {
                setIsActive(false);
            }
        };

        const handleMouseUp = () => {
            setIsActive(false);
        };

        const handleTouchStart = handleMouseDown;
        const handleTouchMove = handleMouseMove;
        const handleTouchEnd = handleMouseUp;

        if (isMobile) {
            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        } else {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (isMobile) {
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            } else {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, []);

    return (
        <ActiveContext.Provider value={{
            isActive,
            setIsActive,
            isHovered,
            setIsHovered,

            isAnimating,
            setIsAnimating,

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