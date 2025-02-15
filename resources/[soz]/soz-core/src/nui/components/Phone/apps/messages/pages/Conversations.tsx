import { PlusIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

import { MessageConversation } from '../../../../../../shared/phone/simcard';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { ContactPicture } from '../../../components/ContactPicture';
import { DayAgo } from '../../../components/DayAgo';
import { ListItem } from '../../../components/List';
import { SearchField } from '../../../components/SearchField';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useContact } from '../../../system/sim-card/hooks/useContact';
import { useConversations } from '../../../system/sim-card/hooks/useConversation';
import { replaceEmoji } from '../../../utils/emoji';

export const Conversations = (): any => {
    const messageApp = useApp('messages');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeConfig();

    const { conversations, searchValue, setSearchValue } = useConversations();

    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <PlusIcon className="cursor-pointer size-5" />,
            onClick: () => navigate('/messages/new'),
        },
    ]);

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle app={messageApp} />
                <div className="sticky top-0 z-10">
                    <SearchField onChange={e => setSearchValue(e.target.value)} value={searchValue} />
                </div>

                {conversations && conversations.length > 0 ? (
                    <FixedSizeList
                        height={720}
                        width={410}
                        itemSize={60}
                        itemCount={conversations.length}
                        itemData={conversations}
                        className={clsx(
                            'rounded-xl scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                            {
                                'scrollbar-thumb-white/80': theme === 'dark',
                                'scrollbar-thumb-black/20': theme === 'light',
                            }
                        )}
                    >
                        {ConversationItem}
                    </FixedSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('MESSAGES.FEEDBACK.NO_CONVERSATION')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const ConversationItem: FunctionComponent<VirtualizedListProps<MessageConversation & { last_message: string }>> = ({
    index,
    style,
    data,
}) => {
    const navigate = useNavigate();
    const theme = useThemeConfig();

    const conversation = data[index];

    const contact = useContact(conversation.phoneNumber);

    if (!conversation) return null;

    return (
        <ListItem style={style} onClick={() => navigate(`/messages/${conversation.conversation_id}`)}>
            <div className="grow flex items-center gap-2 p-2 min-w-0">
                <div className="relative flex-shrink-0">
                    <ContactPicture picture={contact?.avatar} />
                    {conversation.unread > 0 && (
                        <span
                            className={clsx(
                                'absolute -top-1 -right-1 flex justify-center items-center py-1 px-2 rounded-full ring-2 bg-red-400 text-xs text-white',
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

                <div
                    className={clsx('grow flex flex-col truncate min-w-0', {
                        'text-gray-100': theme === 'dark',
                        'text-gray-700': theme === 'light',
                    })}
                >
                    <p className="truncate">{contact?.display ?? conversation.phoneNumber}</p>
                    <p className="truncate text-gray-500">{replaceEmoji(conversation.last_message)}</p>
                </div>

                <div className="flex-shrink-0">
                    <p
                        className={clsx('text-left text-sm font-medium', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-600': theme === 'light',
                        })}
                    >
                        <DayAgo timestamp={conversation.updatedAt} />
                    </p>
                </div>
            </div>
        </ListItem>
    );
};
