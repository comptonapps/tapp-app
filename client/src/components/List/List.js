import './List.css';

import React from 'react'

function List({children}) {
    return (
        <div className="List">
            {children}
        </div>
    )
}

export default List
