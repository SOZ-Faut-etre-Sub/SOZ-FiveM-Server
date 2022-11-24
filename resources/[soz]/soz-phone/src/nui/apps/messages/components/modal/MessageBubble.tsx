import { Menu, Transition } from '@headlessui/react';
import { DuplicateIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageEvents } from '@typings/messages';
import { PictureReveal } from '@ui/old_components/PictureReveal';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { useConfig } from '../../../../hooks/usePhone';
import { usePhoneNumber } from '../../../../hooks/useSimCard';
import { setClipboard } from '../../../../os/phone/hooks/useClipboard';
import Emoji from '../../../../ui/components/Emoji';
import { Button } from '../../../../ui/old_components/Button';

const isImage = url => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

const isPosition = url => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const config = useConfig();
    const myNumber = usePhoneNumber();

    const setWaypoint = () => {
        const position = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position[1],
            y: position[2],
        });
    };

    const isMine = message.author === myNumber;

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
                    'bg-[#32CA5B] text-white': isMine,
                    'bg-ios-700 text-white': !isMine && config.theme.value === 'dark',
                    'bg-[#E9E9EB] text-dark': !isMine && config.theme.value === 'light',
                })}
            >
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
                            className={cn('break-words text-ellipsis w-full select-text', {
                                'text-base': config.textZoom.value === 1.0,
                                'text-lg': config.textZoom.value === 1.2,
                                'text-xl': config.textZoom.value === 1.4,
                                'text-2xl': config.textZoom.value === 1.6,
                            })}
                        >
                            {message.message.split(/(:[a-zA-Z0-9-_+]+:)/g).map(text => {
                                if (text.startsWith(':') && text.endsWith(':')) {
                                    return <Emoji emoji={text} />;
                                }

                                return text;
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
                    {dayjs(message.createdAt).format('HH:mm')}
                </div>
            </div>
        </div>
    );
};
