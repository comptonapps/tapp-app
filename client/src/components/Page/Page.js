import './Page.css';

import React from 'react'

function Page({children, cls}) {
    return (
        <div className={`Page ${cls}`}>
            <div className='Page-content'>
                {children}
            </div>
        </div>
    )
}

export default Page;
