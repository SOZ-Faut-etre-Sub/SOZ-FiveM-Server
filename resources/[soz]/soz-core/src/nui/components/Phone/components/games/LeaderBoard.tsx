import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import clsx from 'clsx';
import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

import { useAppTitleGetBackUpdater } from '../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useThemeConfig } from '../../system/config/config.atom';
import { ContactPicture } from '../ContactPicture';
import { AppContent } from '../system/AppContent';
import { AppTitle } from '../system/AppTitle';
import { AppWrapper } from '../system/AppWrapper';

export const Leaderboard = ({ leaderboard }: { leaderboard: LeaderboardInterface[] }) => {
    const navigate = useNavigate();

    const theme = useThemeConfig();

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    useAppTitleGetBackUpdater(() => navigate(-1));

    return (
        <AppWrapper scrollable>
            <AppTitle title="Classement" />
            <AppContent>
                <div className="py-8 grid grid-cols-3 text-center gap-3">
                    {top3.map((player, i) => (
                        <div
                            key={player.citizenid}
                            className={clsx('flex flex-col w-full rounded-md shadow', {
                                'text-white bg-ios-700': theme === 'dark',
                                'bg-white': theme === 'light',
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

                <List height={500} width={410} itemSize={85} itemCount={rest.length} itemData={rest}>
                    {RowRenderer}
                </List>
            </AppContent>
        </AppWrapper>
    );
};

const RowRenderer = ({ index, style, data }: { index: number; style: CSSProperties; data: LeaderboardInterface[] }) => {
    const theme = useThemeConfig();

    const player = data[index];
    if (!player) return null;

    return (
        <div key={player.citizenid} style={style}>
            <div
                className={clsx('w-full rounded-md shadow', {
                    'text-white bg-ios-700': theme === 'dark',
                    'bg-white': theme === 'light',
                })}
            >
                <div className="flex justify-between items-center px-2 py-4 gap-6">
                    <span className="relative inline-block">
                        <ContactPicture picture={player.avatar} />
                        <span
                            className={clsx(
                                'absolute right-0 top-0 block px-1 text-sm -translate-y-1/2 translate-x-1/2 transform rounded-full bg-[#C0C0C0] text-gray-700 ring-2',
                                {
                                    'ring-ios-700': theme === 'dark',
                                    'ring-white': theme === 'light',
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
