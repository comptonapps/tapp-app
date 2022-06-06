import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function AuthGate({children}) {
    const user = useSelector(st => st.sessionState.user);
    if (!user) {
        return <Redirect to='/auth' />
    }
    return children;
}

export default AuthGate
