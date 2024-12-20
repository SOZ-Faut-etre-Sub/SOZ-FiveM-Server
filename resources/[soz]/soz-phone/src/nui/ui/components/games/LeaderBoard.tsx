import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { LeaderboardInterface } from '@typings/common';
import cn from 'classnames';
import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

import { useConfig } from '../../../hooks/usePhone';
import { Button } from '../../old_components/Button';
import { AppContent } from '../AppContent';
import { AppTitle } from '../AppTitle';
import { AppWrapper } from '../AppWrapper';
import { ContactPicture } from '../ContactPicture';

const LIST_HEIGHT = 430;
const LIST_WIDTH = 380;
const LIST_ITEM_HEIGHT = 85;

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
                                    <p>{`${player.game_played} partie${player.game_played > 1 ? 's' : ''} jouée${
                                        player.game_played > 1 ? 's' : ''
                                    }`}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <List
                        height={LIST_HEIGHT}
                        width={LIST_WIDTH}
                        itemSize={LIST_ITEM_HEIGHT}
                        itemCount={rest.length}
                        itemData={rest}
                    >
                        {RowRenderer}
                    </List>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};

const RowRenderer = ({ index, style, data }: { index: number; style: CSSProperties; data: LeaderboardInterface[] }) => {
    const config = useConfig();

    const player = data[index];
    if (!player) return null;

    return (
        <div key={player.citizenid} style={style}>
            <div
                className={cn('w-full rounded-md shadow', {
                    'text-white bg-ios-700': config.theme.value === 'dark',
                    'bg-white': config.theme.value === 'light',
                })}
            >
                <div className="flex justify-between items-center px-2 py-4 gap-6">
                    <span className="relative inline-block">
                        <ContactPicture picture={player.avatar} />
                        <span
                            className={cn(
                                'absolute right-0 top-0 block px-1 text-sm -translate-y-1/2 translate-x-1/2 transform rounded-full bg-[#C0C0C0] text-gray-700 ring-2',
                                {
                                    'ring-ios-700': config.theme.value === 'dark',
                                    'ring-white': config.theme.value === 'light',
                                }
                            )}
                        >
                            #{index + 4}
                        </span>
                    </span>

                    <div className="flex flex-col flex-grow min-w-0">
                        <div className="truncate" title={player.player_name}>
                            {player.player_name}
                        </div>

                        <div>
                            {`${player.game_played} partie${player.game_played > 1 ? 's' : ''} jouée${
                                player.game_played > 1 ? 's' : ''
                            }`}
                        </div>
                    </div>
                    <div className="flex-shrink font-semibold text-xl">{player.score}</div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
