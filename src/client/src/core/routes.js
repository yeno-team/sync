import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { HomeLayout } from '../scenes/HomeScreen/HomeLayout';
import InputScreen from '../components/InputScreen';
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
                    <InputScreen inputName="username" nextComponent={RoomLayout} />
                </Route>

                <Route path="/rooms" exact>
                    <RoomsLayout />
                </Route>
            </Switch>
        </Router>
    )
}