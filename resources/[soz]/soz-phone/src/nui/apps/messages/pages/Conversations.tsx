import 'dayjs/locale/fr';

import { PlusIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { SearchField } from '@ui/old_components/SearchField';
import cn from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useApp } from '../../../os/apps/hooks/useApps';
import { RootState } from '../../../store';
import { ThemeContext } from '../../../styles/themeProvider';
import { AppTitle } from '../../../ui/components/AppTitle';

dayjs.extend(relativeTime);

export const Conversations = (): any => {
    const messageApp = useApp('messages');

    const [t] = useTranslation();
    const { theme } = useContext(ThemeContext);

    const conversations = useSelector((state: RootState) => state.simCard.conversations);
    const [searchValue, setSearchValue] = useState<string>('');

    const filteredConversations = useMemo(() => {
        const regExp = new RegExp(searchValue.replace(/[^a-zA-Z\d]/g, ''), 'gi');

        return conversations.filter(
            conversation => conversation?.display?.match(regExp) || conversation.phoneNumber.match(regExp)
        );
    }, [conversations, searchValue]);

    const { getDisplayByNumber } = useContact();

    return (
        <>
            <AppTitle
                app={messageApp}
                action={
                    <Link to="/messages/new">
                        <PlusIcon className="h-6 w-6 cursor-pointer" />
                    </Link>
                }
            >
                <div />
            </AppTitle>
            <AppContent>
                <SearchField
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
                />
                <nav className="h-[740px] pb-10 my-2 overflow-y-auto" aria-label="Directory">
                    <ul className={`relative divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {Array.from(filteredConversations)
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map(conversation => (
                                <Link
                                    is="li"
                                    to={`/messages/${conversation.conversation_id}`}
                                    key={conversation.conversation_id}
                                    className={`${theme === 'dark' ? 'bg-black' : 'bg-ios-50'} w-full cursor-pointer`}
                                >
                                    <div
                                        className={`relative px-6 py-2 flex items-center space-x-3 ${
                                            theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 inline-block relative">
                                            {conversation.avatar ? (
                                                <img
                                                    className={`h-10 w-10 ${
                                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                    } rounded-full`}
                                                    src={conversation.avatar}
                                                    alt=""
                                                />
                                            ) : (
                                                <div
                                                    className={`h-10 w-10 ${
                                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                    } rounded-full`}
                                                />
                                            )}
                                            {conversation.unread > 0 && (
                                                <span
                                                    className={cn(
                                                        'absolute -top-1 -right-1 block h-4 px-1 w-auto rounded-full ring-2 bg-red-400 text-xs text-white',
                                                        {
                                                            'ring-gray-700': theme === 'dark',
                                                            'ring-gray-100': theme !== 'dark',
                                                        }
                                                    )}
                                                >
                                                    {conversation.unread}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 cursor-pointer">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <p
                                                className={`text-left text-sm font-medium truncate ${
                                                    theme === 'dark' ? 'text-gray-100' : 'text-gray-600'
                                                }`}
                                            >
                                                {getDisplayByNumber(conversation.phoneNumber)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <p
                                                className={`text-left text-sm font-medium ${
                                                    theme === 'dark' ? 'text-gray-100' : 'text-gray-600'
                                                }`}
                                            >
                                                {dayjs(conversation.updatedAt)
                                                    .locale('fr')
                                                    .from(dayjs(new Date().getTime()), true)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </ul>
                </nav>
            </AppContent>
        </>
    );
};
