import React, { FunctionComponent } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { SnakeGame } from './pages/SnakeGame';
import { SnakeLeaderboard } from './pages/SnakeLeaderboard';

export const SnakeApp: FunctionComponent = () => {
    const { pathname } = useLocation();

    return (
        <AppContainer forceControlColor={pathname === '/snake' ? 'light' : 'dark'}>
            <Routes>
                <Route index element={<SnakeGame />} />
                <Route path="leaderboard" element={<SnakeLeaderboard />} />
            </Routes>
        </AppContainer>
    );
};
