import React, { useState, useEffect } from 'react';

function FPSCounter() {
    const [fps, setFps] = useState(0);
    let lastFrameTime = performance.now();
    let frameCount = 0;

    useEffect(() => {
        const updateFps = () => {
            const now = performance.now();
            const deltaTime = now - lastFrameTime;
            frameCount++;

            if (deltaTime >= 1000) {
                setFps(frameCount * 1000 / deltaTime);
                frameCount = 0;
                lastFrameTime = now;
            }

            requestAnimationFrame(updateFps);
        };

        const rafId = requestAnimationFrame(updateFps);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2px 10px', borderRadius: '5px', fontSize: '16px' }}>
            FPS: {fps.toFixed(1)}
        </div>
    );
}

export default FPSCounter;