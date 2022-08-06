import { Menu, Transition } from '@headlessui/react';
import { BookmarkIcon, ChatIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import { SocietyEvents } from '@typings/society';
import { Button } from '@ui/old_components/Button';
import { fetchNui } from '@utils/fetchNui';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSociety } from '../../../hooks/app/useSociety';
import { ThemeContext } from '../../../styles/themeProvider';
require('dayjs/locale/fr');
dayjs.locale('fr');

const MessagesList = (): any => {
    const { theme } = useContext(ThemeContext);
    const { initializeCall } = useCall();
    const navigate = useNavigate();

    const { getSocietyMessages } = useSociety();
    const societyMessages = getSocietyMessages();

    const startCall = (number: string) => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(number);
    };

    const startMessage = (phoneNumber: string) => {
        LogDebugEvent({
            action: 'Routing to Message',
            level: 1,
            data: { phoneNumber },
        });
        navigate(`/messages/new?phoneNumber=${phoneNumber}`);
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

    return (
        <ul className={`mt-5 relative divide-y space-y-1`}>
            {Array.from(societyMessages)
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(message => (
                    <Menu
                        key={message.id}
                        as="li"
                        className={`w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-md shadow`}
                    >
                        <Menu.Button className="w-full">
                            <div
                                className={`relative px-6 py-2 flex items-center space-x-3 ${
                                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
                                }`}
                            >
                                <div className="flex-1 min-w-0 cursor-pointer">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p
                                        className={`text-left text-sm font-medium ${
                                            theme === 'dark' ? 'text-gray-100' : 'text-gray-700'
                                        }`}
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
                                        <span>{dayjs().to(message.createdAt)}</span>
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
                            <Menu.Items className="w-56 mt-2 origin-top-right bg-gray-900 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
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
