import { useAtomValue } from 'jotai/index';

import { messagesAtom } from '../darkweb.atom';

export const useMessages = (conversationId: string) => {
    return useAtomValue(messagesAtom).filter(message => message.conversation_id.toString() === conversationId);
};
