import React, {useState} from 'react';
import {Message, MessageEvents} from '@typings/messages';
import {PictureReveal} from '@ui/components/PictureReveal';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import {useSetSelectedMessage} from '../../hooks/state';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {LocationMarkerIcon} from "@heroicons/react/solid";
import {DotsVerticalIcon} from "@heroicons/react/outline";


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
    const [menuOpen, setMenuOpen] = useState(false);

    const setSelectedMessage = useSetSelectedMessage();
    const myNumber = useMyPhoneNumber();
    const openMenu = () => {
        setMenuOpen(true);
        setSelectedMessage(message);
    };
    const setWaypoint = () => {
        let position = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position[1],
            y: position[2],
        })
    };

    const isMine = message.author === myNumber;

    return (
        <div className={`flex ${isMine && "justify-end"}`}>
            <div className={`flex justify-between text-white w-3/4 rounded-2xl ${isMine ? "bg-[#32CA5B]" : "bg-[#26252A]"} p-3 m-2`}>
                <div>
                    {isImage(message.message) && (
                        <PictureReveal>
                            <img src={message.message} className="rounded-lg" alt="message multimedia"/>
                        </PictureReveal>
                    )}
                    {isPosition(message.message) && (
                        <span className="flex items-center cursor-pointer" onClick={setWaypoint}>
                            <LocationMarkerIcon className="h-5 w-5 mr-2" />Position
                        </span>
                    )}
                    {!isImage(message.message) && !isPosition(message.message) && (
                        <>{message.message}</>
                    )}
                </div>
                {isMine &&
                    <DotsVerticalIcon className="h-5 w-5 cursor-pointer" onClick={openMenu} />
                }
            </div>
            <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)}/>
        </div>
    );
};
