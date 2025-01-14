import { useAtomValue } from 'jotai';
import { useAtom } from 'jotai/index';
import { useEffect } from 'react';

import { conversationsAtom, conversationSearchQueryAtom, filteredConversationsAtom } from '../sim.card.atom';

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

export const useConversation = (id: string) => {
    const conversations = useAtomValue(conversationsAtom);
    return conversations.find(c => c.conversation_id === id);
};
