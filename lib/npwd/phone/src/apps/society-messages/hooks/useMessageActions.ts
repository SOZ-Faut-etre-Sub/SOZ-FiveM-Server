import {messageState, useSetMessages} from './state';
import {useCallback} from 'react';
import {useRecoilValueLoadable} from 'recoil';
import {SocietyMessage} from "@typings/society";

interface MessageActionProps {
    updateLocalMessages: (messageDto: SocietyMessage) => void;
}

export const useMessageActions = (): MessageActionProps => {
    const {state: messageLoading} = useRecoilValueLoadable(messageState.messages);
    const setMessages = useSetMessages();

    const updateLocalMessages = useCallback((messageDto: SocietyMessage) => {
            if (messageLoading !== 'hasValue') return;

            setMessages((currVal) => [
                {
                    id: messageDto.id,
                    conversation_id: messageDto.conversation_id,
                    source_phone: messageDto.source_phone,
                    message: messageDto.message,
                    position: messageDto.position,
                    isTaken: messageDto.isTaken,
                    isDone: messageDto.isDone,
                    createdAt: messageDto.createdAt,
                    updatedAt: messageDto.updatedAt
                },
                ...currVal,
            ]);
        },
        [messageLoading, setMessages],
    );

    return {
        updateLocalMessages,
    };
};
