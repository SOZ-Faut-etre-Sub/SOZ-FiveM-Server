import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { Message, Separator } from '../../../../../../shared/phone/simcard';
import { messagesAtom } from '../sim.card.atom';

export const useMessages = (conversationId: string) => {
    const allMessages = useAtomValue(messagesAtom);

    return useMemo(() => {
        let lastDate = new Date();
        const messages: (Message | Separator)[] = [];

        allMessages
            .filter(message => message.conversation_id === conversationId)
            .sort((a, b) => a.createdAt - b.createdAt)
            .forEach(message => {
                const date = new Date(message.createdAt);

                if (date.getDate() !== lastDate.getDate()) {
                    messages.push({
                        separator: true,
                        display: format(new Date(message.createdAt), 'PP', {
                            locale: fr,
                        }),
                    });
                    lastDate = date;
                }

                messages.push(message);
            });

        return messages;
    }, [allMessages, conversationId]);
};
