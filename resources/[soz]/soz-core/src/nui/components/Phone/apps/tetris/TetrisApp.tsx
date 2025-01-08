import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppContainer } from '../../components/system/AppContainer';
import { TetrisGame } from './pages/TetrisGame';
import { TetrisLeaderboard } from './pages/TetrisLeaderboard';

export const TetrisApp = () => {
    const { pathname } = useLocation();

    return (
        <AppContainer forceControlColor={pathname === '/tetris' ? 'light' : 'dark'}>
            <Routes>
                <Route index element={<TetrisGame />} />
                <Route path="leaderboard" element={<TetrisLeaderboard />} />
            </Routes>
        </AppContainer>
    );
};
