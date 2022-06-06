import './Auth.css';
import React from 'react';
import Page from '../Page/Page';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom'; 
import NewAuthForm from '../NewAuthForm/NewAuthForm';

function Auth() {
    const user = useSelector(st => st.sessionState.user);
    if (user) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Page cls="Auth">
            <NewAuthForm />
        </Page>
            
    );
};

export default Auth;
