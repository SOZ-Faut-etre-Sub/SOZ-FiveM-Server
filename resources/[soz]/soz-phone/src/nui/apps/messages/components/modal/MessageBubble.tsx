import { Menu, Transition } from '@headlessui/react';
import { DuplicateIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageEvents } from '@typings/messages';
import { PictureReveal } from '@ui/old_components/PictureReveal';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
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

    const messageColor = () => {
        if (isMine) {
            return 'bg-[#32CA5B] text-white';
        } else {
            return config.theme.value === 'dark' ? 'bg-ios-700 text-white' : 'bg-[#E9E9EB] text-dark';
        }
    };

    return (
        <div className={`relative flex ${isMine && 'justify-end'}`}>
            <Menu as="div" className={`flex justify-between w-3/4 rounded-2xl ${messageColor()} p-3 m-2 text-ellipsis`}>
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
                        <p className="break-words text-ellipsis w-full select-text">
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
        </div>
    );
};
