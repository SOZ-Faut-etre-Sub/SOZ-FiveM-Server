import { Menu, Transition } from '@headlessui/react';
import { DuplicateIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { Message } from '@public/shared/phone/simcard';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { useClipboard } from '../../../../../hook/clipboard';
import { Button } from '../../../components/Button';
import { Emoji } from '../../../components/Emoji';
import { PictureReveal } from '../../../components/PictureReveal';
import { useTextZoomConfig, useThemeConfig } from '../../../system/config/config.atom';
import { useSimCard } from '../../../system/sim-card/hooks/useSimCard';

const isImage = url => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
};

const isOldPosition = url => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

const isPosition = url => {
    return /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

const getAddress = async (input: string) => {
    const position = /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.exec(input);
    return fetchNui<{ x: number; y: number; z: number }, string[]>(NuiEvent.GetStreetName, {
        x: Number(position[1]),
        y: Number(position[2]),
        z: Number(position[3]),
    });
};

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: FunctionComponent<MessageBubbleProps> = ({ message }) => {
    const { number } = useSimCard();

    const theme = useThemeConfig();
    const textZoom = useTextZoomConfig();
    const copyToClipboard = useClipboard();

    const [address, setAddress] = useState('');
    const setWaypoint = () => {
        const position = /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);
        const oldPosition = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui(NuiEvent.SetWaypoint, {
            x: Number(position ? position[1] : oldPosition[1]),
            y: Number(position ? position[2] : oldPosition[2]),
        });
    };

    useEffect(() => {
        const getAddressAsync = async () => {
            try {
                const address = await getAddress(message.message);
                setAddress(address.join('& '));
            } catch (error) {
                console.error(error);
                setAddress('Destination');
            }
        };
        if (isPosition(message.message)) {
            getAddressAsync();
        }
    }, [message.message]);

    const isMine = message.author === number;

    return (
        <div
            className={clsx('relative flex', {
                'flex-row': !isMine,
                'flex-row-reverse': isMine,
            })}
        >
            <Menu
                as="div"
                className={clsx('flex justify-between w-3/4 rounded-2xl p-3 m-2 text-ellipsis', {
                    'bg-[#32CA5B] text-white': isMine,
                    'bg-ios-700 text-white': !isMine && theme === 'dark',
                    'bg-[#E9E9EB] text-dark': !isMine && theme === 'light',
                })}
            >
                {isImage(message.message) && (
                    <PictureReveal image={message.message}>
                        <img src={message.message} className="rounded-lg" alt="message multimedia" />
                    </PictureReveal>
                )}
                {isPosition(message.message) && (
                    <span className="flex items-center cursor-pointer" onClick={setWaypoint}>
                        <LocationMarkerIcon className="h-5 w-5 mr-2" /> {address}
                    </span>
                )}
                {isOldPosition(message.message) && (
                    <span className="flex items-center cursor-pointer" onClick={setWaypoint}>
                        <LocationMarkerIcon className="h-5 w-5 mr-2" /> Destination
                    </span>
                )}
                {!isImage(message.message) && !isPosition(message.message) && !isOldPosition(message.message) && (
                    <Menu.Button className="left-0 h-full w-full text-left">
                        <p
                            className={clsx('break-words text-ellipsis w-full select-text whitespace-pre-wrap', {
                                'text-base': textZoom === 1.0,
                                'text-lg': textZoom === 1.2,
                                'text-xl': textZoom === 1.4,
                                'text-2xl': textZoom === 1.6,
                            })}
                        >
                            {message.message.split(/(:[a-zA-Z0-9-_+]+:)/g).map((text, i) => {
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
                                onClick={() => copyToClipboard(message.message)}
                            >
                                <DuplicateIcon className="mx-3 h-5 w-5" /> Copier le texte
                            </Button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
            <div className="relative flex self-center">
                <div
                    className={clsx('text-xs', {
                        'text-gray-400': theme === 'dark',
                        'text-gray-500': theme === 'light',
                    })}
                >
                    {format(new Date(message.createdAt), 'HH:mm')}
                </div>
            </div>
        </div>
    );
};
