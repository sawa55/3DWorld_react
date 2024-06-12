import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const ActiveContext = createContext();

export const useActive = () => useContext(ActiveContext);

export const ActiveProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const moveCount = useRef(0);
    const touchCount = useRef(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    useEffect(() => {
        const userAgentHandler = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        window.addEventListener('resize', userAgentHandler);

        return () => {
            window.removeEventListener('resize', userAgentHandler);
        };
    }, []);

    useEffect(() => {
        // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            const handleTouchStart = () => {
                setIsActive(true);
                touchCount.current = 0;
            };

            const handleTouchMove = () => {
                touchCount.current += 1;
                if (touchCount.current >= 2) {
                    setIsActive(false);
                }
            };

            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchmove', handleTouchMove);

            return () => {
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
            };
        } else {
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

            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);

            return () => {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isActive]); // 依赖于 isActive 的变化

    return (
        <ActiveContext.Provider value={{
            isActive,
            setIsActive,
            isHovered,
            setIsHovered,
            isMobile,
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

const PortalClickedContext = createContext();

export const usePortalClicked = () => useContext(PortalClickedContext);

export const PortalClickedProvider = ({ children }) => {
    const [isPortalClicked, setisPortalClicked] = useState(false);

    return (
        <PortalClickedContext.Provider value={{ isPortalClicked, setisPortalClicked }}>
            {children}
        </PortalClickedContext.Provider>
    );
};