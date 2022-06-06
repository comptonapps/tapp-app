import './Cell.css';

import React from 'react'

function Cell({children, hoverable=true}) {
    return (
        <div className={`Cell ${hoverable ? "hoverable" : ""}`}>
            {children}
        </div>
    );
};

export default Cell;
