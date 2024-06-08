import YouTube from 'react-youtube';
import style from './Youtube.module.css';
import React, { useEffect, useState, useMemo, useRef } from 'react';

const Youtube = React.memo(({ videoId, opts }) => {
    const optss = useMemo(() => ({
        height: '300',
        width: "95%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            // autoplay: 1,
            enablejsapi: 1,
            origin: window.location.origin,
        },
    }), []);  // 依存配列を空にすることで、コンポーネントのライフサイクル中で一度だけ計算されます

    console.log('youtube rendered')
    return (<YouTube videoId='bO3tZaz5gZI'
        className={style.iframe}
        containerClassName={style.youtube}
        opts={optss}
    />)

});

export default Youtube;
