import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';
import InputScreen from '../components/InputScreen';
import { RoomLayout } from '../scenes/RoomScreen/RoomLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/room/:code">
                    <InputScreen inputName="username" nextComponent={RoomLayout} />
                </Route>

                <Route path="/">
                    <HomeLayout />
                </Route>
            </Switch>
        </Router>
    )
}