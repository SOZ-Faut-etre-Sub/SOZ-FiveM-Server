import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { LeaderboardInterface } from '@typings/common';
import cn from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { AppContent } from '../../../ui/components/AppContent';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppWrapper } from '../../../ui/components/AppWrapper';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { Button } from '../../../ui/old_components/Button';

export const Leaderboard = ({ leaderboard }: { leaderboard: LeaderboardInterface[] }) => {
    const config = useConfig();
    const navigate = useNavigate();

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppWrapper>
                <AppTitle title="Classement">
                    <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                        <ChevronLeftIcon className="h-5 w-5" />
                        Fermer
                    </Button>
                </AppTitle>
                <AppContent>
                    <div className="py-8 grid grid-cols-3 text-center gap-3">
                        {top3.map((player, i) => (
                            <div
                                key={player.citizenid}
                                className={cn('flex flex-col w-full rounded-md shadow', {
                                    'text-white bg-ios-700': config.theme.value === 'dark',
                                    'bg-white': config.theme.value === 'light',
                                    'order-2 border-t-4 border-[#FFD700] scale-110': i === 0,
                                    'order-1 border-t-4 border-[#C0C0C0]': i === 1,
                                    'order-3 border-t-4 border-[#CD7F32]': i === 2,
                                })}
                            >
                                <div className="flex justify-center">
                                    <ContactPicture picture={player.avatar} size="large" />
                                </div>
                                <div className="flex flex-col justify-between h-full">
                                    <p className="items-start p-1.5">{player.player_name}</p>
                                    <p className="p-2 text-lg font-semibold">{player.score}</p>
                                    <p>{`${player.game_played} partie(s) jouée(s)`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 space-y-3">
                        {rest.map((player, i) => (
                            <div
                                key={player.citizenid}
                                className={cn('w-full rounded-md shadow', {
                                    'text-white bg-ios-700': config.theme.value === 'dark',
                                    'bg-white': config.theme.value === 'light',
                                })}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-shrink text-gray-500 p-4">#{i + 4}</div>
                                    <div className="flex-shrink py-2">
                                        <ContactPicture picture={player.avatar} />
                                    </div>

                                    <div className="flex-grow p-4">
                                        {player.player_name}
                                        <br />
                                        {`${player.game_played} partie(s) jouée(s)`}
                                    </div>
                                    <div className="flex-shrink font-semibold text-xl p-4">{player.score}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};

export default Leaderboard;
