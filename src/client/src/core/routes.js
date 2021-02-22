import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <HomeLayout />
                </Route>
            </Switch>
        </Router>
    )
}