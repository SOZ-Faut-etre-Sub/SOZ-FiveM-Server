import React, {useContext} from 'react';
import useMessages from '../../hooks/useMessages';
import {SearchField} from '@ui/components/SearchField';
import {useTranslation} from 'react-i18next';
import {useFilteredConversationsValue, useFilterValueState} from '../../hooks/state';
import {ThemeContext} from "../../../../styles/themeProvider";

const MessagesList = (): any => {
    const [t] = useTranslation();
    const {theme} = useContext(ThemeContext);

    const {conversations, goToConversation} = useMessages();

    const filteredConversations = useFilteredConversationsValue();
    const [searchValue, setSearchValue] = useFilterValueState();

    if (!conversations) return <p>No messages</p>;

    return (
        <div className="mt-5">
            <SearchField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
            />
            <nav className="h-[780px] pb-10 my-2 overflow-y-auto" aria-label="Directory">
                <ul className={`relative divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {filteredConversations.map((conversation) => (
                        <li key={conversation.conversation_id} className={`${theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'} w-full cursor-pointer`} onClick={() => goToConversation(conversation)}>
                            <div className={`relative px-6 py-2 flex items-center space-x-3 ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'}`}>
                                <div className="flex-shrink-0">
                                    {conversation.avatar ? (
                                        <img className={`h-10 w-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full`} src={conversation.avatar} alt=""/>
                                    ) : (
                                        <div className={`h-10 w-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full`}/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer">
                                    <span className="absolute inset-0" aria-hidden="true"/>
                                    <p className={`text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-600'}`}>{conversation.display || conversation.phoneNumber}</p>
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
