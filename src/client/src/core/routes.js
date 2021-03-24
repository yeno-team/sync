import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import { RoomsLayout } from '../scenes/RoomsScreen/RoomsLayout'
import { RoomLayout } from '../scenes/RoomScreen/RoomLayout';

export function Routes() {
    return (
        <Router>
            <Switch>
                
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