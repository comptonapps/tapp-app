import './SectionTitle.css';

import React from 'react'

function SectionTitle({title, children}) {
    return (
        <div className="SectionTitle">
            <h2>{title}</h2>
            {children}
        </div>
    )
}

export default SectionTitle
