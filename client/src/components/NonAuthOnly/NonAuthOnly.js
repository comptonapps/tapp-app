import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function NonAuthOnly({children}) {
    const user = useSelector(st => st.sessionState.user);
    if (user) {
        return <Redirect to="/dashboard" />
    }
    return children;
}

export default NonAuthOnly
