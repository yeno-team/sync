import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';
import SetUsernameModal from '../components/SetUsernameModal';
import { RoomLayout } from '../scenes/RoomScreen/RoomLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/room/:code">
                    <SetUsernameModal nextComponent={RoomLayout} />
                </Route>

                <Route path="/">
                    <HomeLayout />
                </Route>
            </Switch>
        </Router>
    )
}