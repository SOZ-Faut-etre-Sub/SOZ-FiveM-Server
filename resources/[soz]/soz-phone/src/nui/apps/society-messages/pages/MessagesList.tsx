import { Menu, Transition } from '@headlessui/react';
import { BookmarkIcon, ChatIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import { SocietyEvents } from '@typings/society';
import { Button } from '@ui/old_components/Button';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSociety } from '../../../hooks/app/useSociety';
import { useConfig } from '../../../hooks/usePhone';
import { DayAgo } from '../../../ui/components/DayAgo';
import { useMessageNotifications } from '../hooks/useMessageNotifications';

const MessagesList = (): any => {
    const config = useConfig();
    const { initializeCall } = useCall();
    const navigate = useNavigate();

    const { getSocietyMessages } = useSociety();
    const societyMessages = getSocietyMessages();
    const { removeNotification } = useMessageNotifications();

    const startCall = (number: string) => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(number);
    };

    const startMessage = (phoneNumber: string) => {
        navigate(`/messages/new/${phoneNumber}`);
    };

    const setWaypoint = pos => {
        const position = JSON.parse(pos);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position.x,
            y: position.y,
        });
    };

    const setMessageState = (id, take, done) => {
        fetchNui<ServerPromiseResp<void>>(SocietyEvents.UPDATE_SOCIETY_MESSAGE, {
            id,
            take,
            done,
        });
    };

    useEffect(() => {
        removeNotification();
    }, []);

    return (
        <ul className={`mt-5 relative divide-y space-y-1`}>
            {Array.from(societyMessages)
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(message => (
                    <Menu
                        key={message.id}
                        as="li"
                        className={cn('w-full rounded-md shadow border-none', {
                            'bg-ios-700': config.theme.value === 'dark',
                            'bg-white': config.theme.value === 'light',
                        })}
                    >
                        <Menu.Button className="w-full">
                            <div
                                className={cn('relative px-6 py-2 flex items-center space-x-3 rounded-md', {
                                    'hover:bg-ios-600': config.theme.value === 'dark',
                                    'hover:bg-gray-300': config.theme.value === 'light',
                                })}
                            >
                                <div className="flex-1 min-w-0 cursor-pointer">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p
                                        className={cn('text-left text-sm font-medium', {
                                            'text-gray-100': config.theme.value === 'dark',
                                            'text-gray-700': config.theme.value === 'light',
                                        })}
                                    >
                                        {message.message}
                                    </p>
                                    <p className="flex justify-between text-left text-xs text-gray-400">
                                        {message.isDone ? (
                                            <span>L'appel est fini !</span>
                                        ) : message.isTaken ? (
                                            <span>L'appel est pris par {message.takenByUsername} !</span>
                                        ) : (
                                            <span></span>
                                        )}
                                        <span>
                                            <DayAgo timestamp={message.createdAt} />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </Menu.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            className="absolute z-30 right-0"
                        >
                            <Menu.Items className="w-56 mt-2 origin-top-right bg-ios-600 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                {message.isTaken ? (
                                    !message.isDone && (
                                        <Button
                                            className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                            onClick={() => setMessageState(message.id, true, true)}
                                        >
                                            <BookmarkIcon className="mx-3 h-5 w-5" /> Clôturer l'appel
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                        onClick={() => setMessageState(message.id, true, false)}
                                    >
                                        <BookmarkIcon className="mx-3 h-5 w-5" /> Prendre l'appel
                                    </Button>
                                )}

                                {message.position && (
                                    <Button
                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                        onClick={() => setWaypoint(message.position)}
                                    >
                                        <LocationMarkerIcon className="mx-3 h-5 w-5" /> Aller a la position
                                    </Button>
                                )}

                                {message.source_phone !== '' && (
                                    <Button
                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                        onClick={() => startMessage(message.source_phone)}
                                    >
                                        <ChatIcon className="mx-3 h-5 w-5" /> Message
                                    </Button>
                                )}

                                {message.source_phone !== '' && (
                                    <Button
                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                        onClick={() => startCall(message.source_phone)}
                                    >
                                        <PhoneIcon className="mx-3 h-5 w-5" /> Appeler
                                    </Button>
                                )}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                ))}
        </ul>
    );
};

export default MessagesList;
