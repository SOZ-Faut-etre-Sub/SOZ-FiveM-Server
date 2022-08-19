import 'dayjs/locale/fr';

import { PlusIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { SearchField } from '@ui/old_components/SearchField';
import cn from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { useApp } from '../../../os/apps/hooks/useApps';
import { RootState } from '../../../store';
import { AppTitle } from '../../../ui/components/AppTitle';

dayjs.extend(relativeTime);

export const Conversations = (): any => {
    const messageApp = useApp('messages');

    const [t] = useTranslation();
    const config = useConfig();

    const conversations = useSelector((state: RootState) => state.simCard.conversations);
    const [searchValue, setSearchValue] = useState<string>('');

    const filteredConversations = useMemo(() => {
        const regExp = new RegExp(searchValue.replace(/[^a-zA-Z\d]/g, ''), 'gi');

        return conversations.filter(
            conversation => conversation?.display?.match(regExp) || conversation?.phoneNumber?.match(regExp) || ''
        );
    }, [conversations, searchValue]);

    const { getDisplayByNumber, getPictureByNumber } = useContact();

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
                    <ul
                        className={cn('relative divide-y', {
                            'divide-gray-700': config.theme.value === 'dark',
                            'divide-gray-200': config.theme.value === 'light',
                        })}
                    >
                        {Array.from(filteredConversations)
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map(conversation => (
                                <Link
                                    is="li"
                                    to={`/messages/${conversation.conversation_id}`}
                                    key={conversation.conversation_id}
                                    className={cn('w-full cursor-pointer', {
                                        'bg-black': config.theme.value === 'dark',
                                        'bg-ios-50': config.theme.value === 'light',
                                    })}
                                >
                                    <div
                                        className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                            'hover:bg-gray-900': config.theme.value === 'dark',
                                            'hover:bg-gray-200': config.theme.value === 'light',
                                        })}
                                    >
                                        <div className="flex-shrink-0 inline-block relative">
                                            <div
                                                className={cn('bg-cover bg-center h-10 w-10 rounded-full', {
                                                    'bg-gray-700': config.theme.value === 'dark',
                                                    'bg-gray-100': config.theme.value === 'light',
                                                })}
                                                style={{
                                                    backgroundImage: `url(${getPictureByNumber(
                                                        conversation.phoneNumber
                                                    )})`,
                                                }}
                                            />
                                            {conversation.unread > 0 && (
                                                <span
                                                    className={cn(
                                                        'absolute -top-1 -right-1 block h-4 px-1 w-auto rounded-full ring-2 bg-red-400 text-xs text-white',
                                                        {
                                                            'ring-gray-700': config.theme.value === 'dark',
                                                            'ring-gray-100': config.theme.value !== 'dark',
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
                                                className={cn('text-left text-sm font-medium truncate', {
                                                    'text-gray-100': config.theme.value === 'dark',
                                                    'text-gray-600': config.theme.value === 'light',
                                                })}
                                            >
                                                {getDisplayByNumber(conversation.phoneNumber)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <p
                                                className={cn('text-left text-sm font-medium', {
                                                    'text-gray-100': config.theme.value === 'dark',
                                                    'text-gray-600': config.theme.value === 'light',
                                                })}
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
