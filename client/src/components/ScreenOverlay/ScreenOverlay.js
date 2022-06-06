import './ScreenOverlay.css';

import React from 'react'

function ScreenOverlay({children}) {
    return (
        <div className="ScreenOverlay">
            {children}
        </div>
    )
}

export default ScreenOverlay;
