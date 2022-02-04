import React, {useState} from 'react';
import {useMessagesValue} from "../../hooks/state";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {MessageEvents} from "@typings/messages";
import LogDebugEvent from "@os/debug/LogDebugEvents";
import {useCall} from "@os/call/hooks/useCall";
import {SocietyEvents} from "@typings/society";
import dayjs from "dayjs";
import {Button} from '@ui/components/Button';
import {Menu, Transition} from "@headlessui/react";
import {BookmarkIcon, LocationMarkerIcon, PhoneIcon} from "@heroicons/react/solid";

const MessagesList = (): any => {
    const societyMessages = useMessagesValue();
    const {initializeCall} = useCall();

    const startCall = (number: string) => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(number);
    };

    const setWaypoint = (pos) => {
        let position = JSON.parse(pos);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position.x,
            y: position.y,
        })
    };

    const setMessageState = (id, take, done) => {
        fetchNui<ServerPromiseResp<void>>(SocietyEvents.UPDATE_SOCIETY_MESSAGE, {
            id, take, done,
        })
    };

    return (
        <ul role="list" className="mt-5 relative divide-y divide-gray-700">
            {societyMessages.map((message) => (
                <Menu key={message.conversation_id} as="li" className="bg-black w-full">
                    <Menu.Button className="w-full">
                        <div className="relative px-6 py-2 flex items-center space-x-3 hover:bg-gray-900">
                            <div className="flex-1 min-w-0 cursor-pointer">
                                <span className="absolute inset-0" aria-hidden="true"/>
                                <p className="text-left text-sm font-medium text-gray-100">{message.message}</p>
                                <p className="flex justify-between text-left text-xs text-gray-400">
                                    {message.isDone ? (
                                        <span>L'appel est fini !</span>
                                    ) : (
                                        message.isTaken ? (
                                            <span>L'appel est pris !</span>
                                        ) : (
                                            <span></span>
                                        )
                                    )}
                                    <span>{dayjs().to(message.updatedAt)}</span>
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
                    >
                        <Menu.Items
                            className="absolute z-30 right-0 w-56 mt-2 origin-top-right bg-gray-900 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">

                            {message.source_phone !== '' && (
                                <Button
                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                    onClick={() => startCall(message.source_phone)}
                                >
                                    <PhoneIcon className="mx-3 h-5 w-5"/> Appeler
                                </Button>
                            )}
                            {message.position && (
                                <Button
                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                    onClick={() => setWaypoint(message.position)}
                                >
                                    <LocationMarkerIcon className="mx-3 h-5 w-5"/> Aller a la position
                                </Button>
                            )}
                            {message.isTaken ? (
                                !message.isDone && <Button
                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                    onClick={() => setMessageState(message.id, true, true)}
                                >
                                    <BookmarkIcon className="mx-3 h-5 w-5"/> Clôturer l'appel
                                </Button>
                            ) : (
                                <Button
                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                    onClick={() => setMessageState(message.id, true, false)}
                                >
                                    <BookmarkIcon className="mx-3 h-5 w-5"/> Prendre l'appel
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
