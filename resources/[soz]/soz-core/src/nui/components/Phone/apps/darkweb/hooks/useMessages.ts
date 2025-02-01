import { DarkwebMessage } from '@public/shared/phone/apps/darkweb';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAtomValue } from 'jotai/index';

import { Separator } from '../../../../../../shared/phone/simcard';
import { messagesAtom } from '../darkweb.atom';

export const useMessages = (conversationId: string) => {
    const allMessages = useAtomValue(messagesAtom);

    let lastDate = new Date();
    const messages: (DarkwebMessage | Separator)[] = [];

    if (!allMessages) {
        return messages;
    }

    allMessages
        .filter(message => message.conversation_id.toString() === conversationId)
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
};
