import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { RoomsLayout } from '../scenes/RoomsScreen/RoomsLayout'
import { RoomLayout } from '../scenes/RoomScreen/RoomLayout';
import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <HomeLayout/>
                </Route>

                <Route path="/room/:code">
                    <RoomLayout/>
                </Route>

                <Route path="/rooms" exact>
                    <RoomsLayout />
                </Route>
            </Switch>
        </Router>
    )
}