
import React, { useEffect, useState, useMemo, useRef } from 'react';

const Test = () => {
    console.log('test rendered')
    return (
        <div>a</div>
    )

}

export default React.memo(Test);
