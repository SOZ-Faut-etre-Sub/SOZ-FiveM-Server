import { useAtom, useAtomValue } from 'jotai/index';
import { useEffect } from 'react';

import { conversationsAtom, conversationSearchQueryAtom, filteredConversationsAtom } from '../darkweb.atom';

export const useConversation = (conversationId: string) => {
    return useAtomValue(conversationsAtom).find(conversation => conversation.id.toString() === conversationId);
};

export const useConversations = () => {
    const conversations = useAtomValue(filteredConversationsAtom);
    const [searchValue, setSearchValue] = useAtom(conversationSearchQueryAtom);

    useEffect(() => {
        return () => {
            setSearchValue('');
        };
    }, []);

    return {
        searchValue,
        setSearchValue,
        conversations,
    };
};
