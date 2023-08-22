import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/outline';
import { ChatIcon, PencilAltIcon, PhoneIcon, TrashIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppWrapper } from '../../../ui/components/AppWrapper';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { DayAgo } from '../../../ui/components/DayAgo';
import { useBackground } from '../../../ui/hooks/useBackground';
import { ActionButton } from '../../../ui/old_components/ActionButton';
import { Button } from '../../../ui/old_components/Button';
import { NumberField, TextField } from '../../../ui/old_components/Input';
import GameTetrisIcon from '../icon';

export const TetrisLeaderboard: React.FC = () => {
    const config = useConfig();
    const navigate = useNavigate();

    const tetrisLeaderboard = useSelector((state: RootState) => state.appTetrisLeaderboard);

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
                <AppTitle title="Zetris Top15">
                    <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                        <ChevronLeftIcon className="h-5 w-5" />
                        Fermer
                    </Button>
                </AppTitle>
                <AppContent>
                    <div className="space-y-1">
                        {tetrisLeaderboard.map((player, i) => (
                            <div
                                key={player.citizenid}
                                className={cn('relative px-6 py-2 flex items-center space-x-3 rounded-md', {
                                    'bg-[#FFD700]': i === 0,
                                    'bg-[#C0C0C0]': i === 1,
                                    'bg-[#CD7F32]': i === 2,
                                })}
                            >
                                <div className="flex-1 min-w-0">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p
                                        className={cn('text-left text-xs font-bold', {
                                            'text-white': config.theme.value === 'dark',
                                            'text-gray-500': config.theme.value === 'light',
                                        })}
                                    >
                                        <span
                                            className={cn('rounded-full px-3 py-0', {
                                                'bg-gray-200': config.theme.value === 'light',
                                                'bg-gray-600': config.theme.value === 'dark',
                                            })}
                                        >
                                            {player.player_name}
                                        </span>
                                    </p>
                                    <p
                                        className={cn('text-left text-sm font-medium break-words', {
                                            'text-gray-100': config.theme.value === 'dark',
                                            'text-gray-700': config.theme.value === 'light',
                                        })}
                                    >
                                        {player.score}
                                    </p>
                                    <p className="flex justify-between text-left text-xs text-gray-400">
                                        <span>{player.game_played} parties jouée</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};

export default TetrisLeaderboard;
