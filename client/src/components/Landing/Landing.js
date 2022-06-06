import './Landing.css';

import React from 'react'
import Page from '../Page/Page';
import PageTitle from '../PageTitle/PageTitle';
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <Page cls="Landing">
            <PageTitle title="Welcome!" />
            <main className="Landing-message">
                <p>Enter What's on tApp? to view draught lists from local establishments or find your favorite drinks in your city!</p>
                <Link className="button-link" to="/auth">Enter Here</Link>
            </main>
            
        </Page>    
    )
}

export default Landing
