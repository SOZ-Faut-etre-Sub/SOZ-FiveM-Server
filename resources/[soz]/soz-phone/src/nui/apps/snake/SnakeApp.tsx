import { Transition } from '@headlessui/react';
import Leaderboard from '@ui/components/games/LeaderBoard';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import { RootState } from '../../store';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { SnakeHome } from './pages/SnakeHome';

export const SnakeApp: React.FC = () => {
    const backgroundClass = useBackground();
    const { pathname } = useLocation();

    return (
        <FullPageWithHeader className={backgroundClass}>
            {pathname === '/snake' && (
                <div
                    className="overflow-hidden absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(media/snake_bg.webp)`,
                    }}
                />
            )}
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-center duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-center duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<SnakeHome />} />
                        <Route
                            path="leaderboard"
                            element={
                                <Leaderboard
                                    leaderboard={useSelector((state: RootState) => state.appSnakeLeaderboard)}
                                />
                            }
                        />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
