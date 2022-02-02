import React, {useState} from 'react';
import {Message, MessageEvents} from '@typings/messages';
import {PictureResponsive} from '@ui/components/PictureResponsive';
import {PictureReveal} from '@ui/components/PictureReveal';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import {useSetSelectedMessage} from '../../hooks/state';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";


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
        <>
            <div className={isMine ? "classes.mySms" : "classes.sms"}>
                <div className={"classes.message"}>
                    {isImage(message.message) && (
                        <PictureReveal>
                            <PictureResponsive src={message.message} alt="message multimedia"/>
                        </PictureReveal>
                    )}
                    {isPosition(message.message) && (
                        <span style={{cursor: "pointer"}} onClick={setWaypoint}>
              {/*<AddLocationAltIcon/> */}
                            Position
            </span>
                    )}
                    {!isImage(message.message) && !isPosition(message.message) && (
                        <>{message.message}</>
                    )}
                    {/*{isMine && (*/}
                    {/*    <IconButton onClick={openMenu}>*/}
                    {/*        <MoreVertIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*)}*/}
                </div>
            </div>
            <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)}/>
        </>
    );
};
