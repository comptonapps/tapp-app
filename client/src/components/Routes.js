import { Switch, Route } from 'react-router-dom';

import React from 'react'
import Landing from './Landing/Landing';
import Auth from './Auth/Auth';
import AuthGate from './AuthGate/AuthGate';
import Dashboard from './Dashboard/Dashboard';
import Drinks from './Drinks/Drinks';
import Drink from './Drink/Drink';
import Places from './Places/Places';
import Place from './Place/Place';
import EditPlace from './EditPlace/EditPlace';
import EditPlaceRedux from './EditPlaceRedux/EditPlaceRedux';
import Logout from './Logout/Logout';
import CreatePlace from './CreatePlace/CreatePlace';
import Oops from './Oops/Oops'


function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Landing />
            </Route>
            <Route exact path="/auth">
                <Auth />
            </Route>
            <AuthGate>
                <Switch>
                    <Route exact path="/drinks">
                        <Drinks />
                    </Route>
                    <Route exact path="/drinks/:id">
                        <Drink />
                    </Route>
                    <Route exact path="/places">
                        <Places />
                    </Route>
                    <Route exact path="/places/new">
                        <CreatePlace />
                    </Route>
                    <Route exact path="/places/:id">
                        <Place />
                    </Route>
                    <Route exact path="/places/:id/edit">
                        <EditPlaceRedux />
                    </Route>
                    <Route exact path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route exact path="/logout">
                        <Logout />
                    </Route>
                    <Route>
                        <Oops />
                    </Route>
                </Switch>
            </AuthGate>
        </Switch>
    )
}

export default Routes
