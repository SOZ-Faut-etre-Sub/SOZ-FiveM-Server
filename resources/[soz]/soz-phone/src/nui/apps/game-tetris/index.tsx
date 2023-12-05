import { Transition } from '@headlessui/react';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import cn from 'classnames';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { TetrisGame } from './pages/TetrisGame';
import { TetrisLeaderboard } from './pages/TetrisLeaderboard';

export const GameTetris: React.FC = () => {
    const backgroundClass = useBackground();
    const { pathname } = useLocation();

    return (
        <FullPageWithHeader
            className={cn({
                'bg-[#38428b]': pathname === '/game-tetris',
                [backgroundClass]: pathname !== '/game-tetris',
            })}
        >
            {pathname === '/game-tetris' && (
                <div
                    className="overflow-hidden absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(media/tetris_bg.webp)`,
                    }}
                />
            )}
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
                <AppWrapper className="h-[775px] w-full">
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
