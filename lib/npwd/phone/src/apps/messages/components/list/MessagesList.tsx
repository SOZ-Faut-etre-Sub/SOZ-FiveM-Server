import React from 'react';
import useMessages from '../../hooks/useMessages';
import {SearchField} from '@ui/components/SearchField';
import {useTranslation} from 'react-i18next';
import {
    useCheckedConversations,
    useFilteredConversationsValue,
    useFilterValueState,
    useIsEditing,
} from '../../hooks/state';

const MessagesList = (): any => {
    const [isEditing, setIsEditing] = useIsEditing();
    const [checkedConversation, setCheckedConversation] = useCheckedConversations();

    const [t] = useTranslation();

    const {conversations, goToConversation} = useMessages();

    const filteredConversations = useFilteredConversationsValue();
    const [searchValue, setSearchValue] = useFilterValueState();

    if (!conversations) return <p>No messages</p>;

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleToggleConversation = (conversationId: string) => {
        const currentIndex = checkedConversation.indexOf(conversationId);
        const newChecked = [...checkedConversation];

        if (currentIndex === -1) {
            newChecked.push(conversationId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedConversation(newChecked);
    };

    return (
        <div className="mt-5">
            <SearchField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
            />
            <nav className="h-[780px] pb-10 my-2 overflow-y-auto" aria-label="Directory">
                <ul role="list" className="relative divide-y divide-gray-700">
                    {filteredConversations.map((conversation) => (
                        <li key={conversation.conversation_id} className="bg-black w-full" onClick={() => goToConversation(conversation)}>
                            <div className="relative px-6 py-2 flex items-center space-x-3 hover:bg-gray-900">
                                <div className="flex-shrink-0">
                                    {conversation.avatar ? (
                                        <img className="h-10 w-10 bg-gray-700 rounded-full" src={conversation.avatar} alt=""/>
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-700 rounded-full"/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer">
                                    <span className="absolute inset-0" aria-hidden="true"/>
                                    <p className="text-left text-sm font-medium text-gray-100">{conversation.display || conversation.phoneNumber}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default MessagesList;
