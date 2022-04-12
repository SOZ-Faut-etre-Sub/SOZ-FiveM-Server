import React, {useContext, useState} from 'react';
import {Message, MessageEvents} from '@typings/messages';
import {PictureReveal} from '@ui/components/PictureReveal';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {LocationMarkerIcon} from "@heroicons/react/solid";
import {ThemeContext} from "../../../../styles/themeProvider";


const isImage = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

const isPosition = (url) => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const {theme} = useContext(ThemeContext);
    const myNumber = useMyPhoneNumber();
    const setWaypoint = () => {
        let position = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position[1],
            y: position[2],
        })
    };

    const isMine = message.author === myNumber;

    const messageColor = () => {
        if (isMine) {
            return 'bg-[#32CA5B] text-white'
        } else {
            return theme === 'dark' ? 'bg-[#26252A] text-white' : 'bg-[#E9E9EB] text-dark'
        }
    }

    return (
        <div className={`flex ${isMine && "justify-end"}`}>
            <div className={`flex justify-between w-3/4 rounded-2xl ${messageColor()} p-3 m-2`}>
                <div>
                    {isImage(message.message) && (
                        <PictureReveal>
                            <img src={message.message} className="rounded-lg" alt="message multimedia"/>
                        </PictureReveal>
                    )}
                    {isPosition(message.message) && (
                        <span className="flex items-center cursor-pointer" onClick={setWaypoint}>
                            <LocationMarkerIcon className="h-5 w-5 mr-2"/> Destination
                        </span>
                    )}
                    {!isImage(message.message) && !isPosition(message.message) && (
                        <>{message.message}</>
                    )}
                </div>
            </div>
        </div>
    );
};
