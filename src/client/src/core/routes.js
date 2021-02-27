import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';
import { RoomLayout } from '../scenes/RoomScreen/RoomLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                
                <Route path="/room/:code">
                    <RoomLayout />
                </Route>

                <Route path="/">
                    <HomeLayout />
                </Route>
            </Switch>
        </Router>
    )
}