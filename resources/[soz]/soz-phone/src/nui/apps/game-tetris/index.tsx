import './assets/style.css';

import { Transition } from '@headlessui/react';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { TetrisGame } from './pages/TetrisGame';
import { TetrisLeaderboard } from './pages/TetrisLeaderboard';

export const GameTetris: React.FC = () => {
    return (
        <FullPageWithHeader className="bg-ios-800">
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[60%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="z-10 scale-100 opacity-100"
                leave="transition-all origin-[60%_20%] duration-300"
                leaveFrom="z-10 scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper className="h-[850px] w-full under-top-bar" underTopBar="true">
                    <Routes>
                        <Route index element={<TetrisGame />} />
                        <Route path="leaderboard" element={<TetrisLeaderboard />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
export default GameTetris;
