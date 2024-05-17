import React, { createContext, useState, useContext, useEffect } from 'react';

const ActiveContext = createContext();

export const useActive = () => useContext(ActiveContext);

export const ActiveProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [moveCount, setMoveCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);  // isHovered 状態を追加
    const [hoveredId, setHoveredId] = useState(null);
    const [globalId, setGlobalId] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const [doubleClickHandler, setDoubleClickHandler] = useState(null);

    useEffect(() => {
        const handleMouseDown = () => {
            setIsActive(true);
            setMoveCount(0);
        };

        const handleMouseMove = () => {
            setMoveCount(prevCount => prevCount + 1);
        };

        const handleMouseUp = () => {
            setIsActive(false);
            setMoveCount(0);
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

    useEffect(() => {
        if (moveCount >= 6) {
            setIsActive(false);
        }
    }, [moveCount]);

    return (
        <ActiveContext.Provider value={{
            isActive,
            setIsActive,
            isHovered,
            setIsHovered,
            hoveredId,
            setHoveredId,
            isAnimating,
            setIsAnimating,
            globalId,
            setGlobalId,

        }}>
            {children}
        </ActiveContext.Provider>
    );
};