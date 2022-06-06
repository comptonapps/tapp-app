import './PageHeader.css';

import React from 'react'

function PageHeader({children}) {
    return (
        <div className="PageHeader">
            {children}
        </div>
    )
}

export default PageHeader
