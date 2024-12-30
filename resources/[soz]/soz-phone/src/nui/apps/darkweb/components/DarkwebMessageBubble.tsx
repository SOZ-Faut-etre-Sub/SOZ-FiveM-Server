import { Menu, Transition } from '@headlessui/react';
import { DuplicateIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { DarkwebMessage } from '@typings/app/darkweb';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import Emoji from '@ui/components/Emoji';
import { Button } from '@ui/old_components/Button';
import { PictureReveal } from '@ui/old_components/PictureReveal';
import cn from 'classnames';
import { format } from 'date-fns';
import React from 'react';

import { fetchNui } from '../../../common/utils/fetchNui';
import { useConfig } from '../../../hooks/usePhone';
import { usePhoneNumber } from '../../../hooks/useSimCard';

const isImage = url => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

const isPosition = url => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

interface DarkWebMessageBubbleProps {
    message: DarkwebMessage;
    participantRole: string;
}

export const DarkWebMessageBubble: React.FC<DarkWebMessageBubbleProps> = ({ message, participantRole }) => {
    const config = useConfig();
    const myNumber = usePhoneNumber();

    const setWaypoint = () => {
        const position = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position[1],
            y: position[2],
        });
    };

    const isMine = message.phoneNumber === myNumber;

    return (
        <div
            className={cn('relative flex', {
                'flex-row': !isMine,
                'flex-row-reverse': isMine,
            })}
        >
            <Menu
                as="div"
                className={cn('flex justify-between w-3/4 rounded-2xl p-3 m-2 text-ellipsis', {
                    'bg-black/10 border-teal-500 border-2 hover:bg-teal-900 text-teal-400': isMine,
                    'bg-black/10 border-red-600 border-2 text-red-600 hover:text-red-500':
                        !isMine && participantRole === 'ADMIN',
                    'bg-teal-900 text-teal-300': !isMine && participantRole === 'USER',
                })}
            >
                {!isMine && participantRole === 'ADMIN' && (
                    <div className="text-red-500 absolute top-0 bg-zinc-900 border-2 border-red-500 rounded-xl px-2 text-xs">
                        ADMIN
                    </div>
                )}
                {isImage(message.message) && (
                    <PictureReveal image={message.message}>
                        <img src={message.message} className="rounded-lg" alt="message multimedia" />
                    </PictureReveal>
                )}
                {isPosition(message.message) && (
                    <span className="flex items-center cursor-pointer" onClick={setWaypoint}>
                        <LocationMarkerIcon className="h-5 w-5 mr-2" /> Destination
                    </span>
                )}
                {!isImage(message.message) && !isPosition(message.message) && (
                    <Menu.Button className="left-0 h-full w-full text-left">
                        <p
                            className={cn('break-words text-ellipsis w-full select-text whitespace-pre-wrap', {
                                'text-base': config.textZoom.value === 1.0,
                                'text-lg': config.textZoom.value === 1.2,
                                'text-xl': config.textZoom.value === 1.4,
                                'text-2xl': config.textZoom.value === 1.6,
                            })}
                        >
                            {message?.message?.split(/(:[a-zA-Z0-9-_+]+:)/g).map((text, i) => {
                                if (text.startsWith(':') && text.endsWith(':')) {
                                    return <Emoji key={i} emoji={text} />;
                                }

                                return <React.Fragment key={i}>{text}</React.Fragment>;
                            })}
                        </p>
                    </Menu.Button>
                )}
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                    className="absolute z-50 top-2 right-0 w-56"
                >
                    <Menu.Items className="mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                        <Menu.Item>
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => setClipboard(message.message)}
                            >
                                <DuplicateIcon className="mx-3 h-5 w-5" /> Copier le texte
                            </Button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
            <div className="relative flex self-center">
                <div
                    className={cn('text-xs', {
                        'text-gray-400': config.theme.value === 'dark',
                        'text-gray-500': config.theme.value === 'light',
                    })}
                >
                    {format(new Date(message.createdAt), 'HH:mm')}
                </div>
            </div>
        </div>
    );
};
