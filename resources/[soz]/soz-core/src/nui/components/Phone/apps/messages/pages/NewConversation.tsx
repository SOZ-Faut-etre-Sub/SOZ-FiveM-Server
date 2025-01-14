import { ChevronRightIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import { Contact, Separator } from '@public/shared/phone/simcard';
import clsx from 'clsx';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { VariableSizeList as List } from 'react-window';

import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { ContactPicture } from '../../../components/ContactPicture';
import { SearchField } from '../../../components/SearchField';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useContacts } from '../../../system/sim-card/hooks/useContact';
import { LIST_ITEM_HEIGHT, LIST_ITEM_SEPARATOR_HEIGHT } from '../../contacts/components/ContactList';
import { useConversationAPI } from '../hooks/useConversationAPI';

export const NewConversation = () => {
    const [t] = useTranslation();
    const { phoneNumber } = useParams<{ phoneNumber?: string }>();
    const navigate = useNavigate();
    const theme = useThemeConfig();

    const { contacts, searchValue, setSearchValue } = useContacts();

    const { addConversation } = useConversationAPI();

    useEffect(() => {
        if (!phoneNumber) return;
        addConversation({ phoneNumber });
    }, [addConversation]);

    useAppTitleGetBackUpdater(() => navigate(-1));

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle title="Contacts" />
                <div className="sticky top-0 z-10">
                    <SearchField
                        placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                        onChange={e => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </div>

                <ul
                    style={{ height: 'calc(100% - 3.5rem)' }}
                    className={clsx('relative divide-y w-full', {
                        'divide-gray-700': theme === 'dark',
                        'divide-gray-200': theme === 'light',
                    })}
                >
                    <List
                        height={720}
                        width={410}
                        itemSize={(index: number) =>
                            'separator' in contacts[index] ? LIST_ITEM_SEPARATOR_HEIGHT : LIST_ITEM_HEIGHT
                        }
                        itemCount={contacts.length}
                        itemData={contacts}
                    >
                        {ContactItem}
                    </List>
                </ul>
            </AppContent>
        </AppWrapper>
    );
};

const ContactItem: FunctionComponent<VirtualizedListProps<Contact | Separator>> = ({ index, style, data }) => {
    const theme = useThemeConfig();
    const { addConversation } = useConversationAPI();

    const contact = data[index];
    if (!contact) return null;

    if ('separator' in contact) {
        return (
            <div
                style={style}
                className={clsx('px-6 py-2 text-sm font-medium', {
                    'bg-ios-800 text-gray-400': theme === 'dark',
                    'bg-ios-50 text-gray-600': theme === 'light',
                })}
            >
                <h3 className="uppercase">{contact.display}</h3>
            </div>
        );
    }

    return (
        <li
            style={style}
            className={clsx('w-full cursor-pointer', {
                'bg-ios-800': theme === 'dark',
                'bg-ios-50': theme === 'light',
            })}
            onClick={() => addConversation({ phoneNumber: contact.number })}
        >
            <div
                className={clsx('relative px-6 py-2 flex items-center space-x-3', {
                    'hover:bg-ios-600': theme === 'dark',
                    'hover:bg-gray-200': theme === 'light',
                })}
            >
                <div className="relative flex-shrink-0">
                    <ContactPicture picture={contact.avatar} />
                    {contact.favorite && (
                        <StarIcon className="absolute right-0 top-0 size-4 text-yellow-500 translate-x-1/4" />
                    )}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer truncate">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p
                        className={clsx('text-left text-sm font-medium', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-600': theme === 'light',
                        })}
                    >
                        {contact.display}
                    </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-300" />
            </div>
        </li>
    );
};
