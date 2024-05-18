import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const ActiveContext = createContext();

export const useActive = () => useContext(ActiveContext);

export const ActiveProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const moveCount = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
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

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
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