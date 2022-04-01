import {messageState, useSetMessages} from './state';
import {useCallback} from 'react';
import {useRecoilValueLoadable} from 'recoil';
import {TwitchNewsMessage} from "@typings/twitch-news";

interface MessageActionProps {
    updateLocalMessages: (messageDto: TwitchNewsMessage) => void;
}

export const useMessageActions = (): MessageActionProps => {
    const {state: messageLoading} = useRecoilValueLoadable(messageState.news);
    const setMessages = useSetMessages();

    const updateLocalMessages = useCallback((messageDto: TwitchNewsMessage) => {
            if (messageLoading !== 'hasValue') return;

            setMessages((currVal) => [
                {
                    id: messageDto.id,
                    type: messageDto.type,
                    image: messageDto.image,
                    message: messageDto.message,
                    createdAt: messageDto.createdAt,
                },
                ...currVal,
            ]);
        },
        [messageLoading, setMessages],
    );

    return { updateLocalMessages };
};
