import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

import { ContactItemProps } from '../../../../../typings/app/contact';
import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { SearchField } from '../../../ui/old_components/SearchField';
import { useMessageAPI } from '../hooks/useMessageAPI';

const LIST_HEIGHT = 693;
const LIST_WIDTH = 380;
const LIST_ITEM_HEIGHT = 63;

export const NewConversation = () => {
    const [t] = useTranslation();
    const { phoneNumber } = useParams<{ phoneNumber?: string }>();
    const navigate = useNavigate();
    const config = useConfig();

    const { getFilteredContacts } = useContact();
    const [searchValue, setSearchValue] = useState<string>('');
    const filteredContacts = useMemo(() => getFilteredContacts(searchValue), [getFilteredContacts, searchValue]);
    const { addConversation } = useMessageAPI();

    useEffect(() => {
        if (phoneNumber) {
            addConversation(phoneNumber);
        }
    }, [addConversation]);

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <>
            <AppTitle title="Contacts">
                <Button className="flex items-center text-base" onClick={handleCancel}>
                    <ChevronLeftIcon className="h-5 w-5" /> Fermer
                </Button>
            </AppTitle>
            <AppContent aria-label="Directory" scrollable={false}>
                <div className="sticky top-0 z-10">
                    <SearchField
                        placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                        onChange={e => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </div>

                <ul
                    style={{ height: 'calc(100% - 3.5rem)' }}
                    className={cn('relative divide-y w-full', {
                        'divide-gray-700': config.theme.value === 'dark',
                        'divide-gray-200': config.theme.value === 'light',
                    })}
                >
                    <List
                        height={LIST_HEIGHT}
                        width={LIST_WIDTH}
                        itemSize={LIST_ITEM_HEIGHT}
                        itemCount={filteredContacts.length}
                        itemData={filteredContacts}
                    >
                        {ContactItem}
                    </List>
                </ul>
            </AppContent>
        </>
    );
};

const ContactItem: FunctionComponent<ContactItemProps> = ({ index, style, data }) => {
    const config = useConfig();
    const { addConversation } = useMessageAPI();

    const contact = data[index];
    if (!contact) return null;

    return (
        <li
            style={style}
            className={cn('w-full cursor-pointer', {
                'bg-ios-800': config.theme.value === 'dark',
                'bg-ios-50': config.theme.value === 'light',
            })}
            onClick={() => addConversation(contact.number)}
        >
            <div
                className={cn('relative px-6 py-2 flex items-center space-x-3', {
                    'hover:bg-ios-600': config.theme.value === 'dark',
                    'hover:bg-gray-200': config.theme.value === 'light',
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
                        className={cn('text-left text-sm font-medium', {
                            'text-gray-100': config.theme.value === 'dark',
                            'text-gray-600': config.theme.value === 'light',
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
