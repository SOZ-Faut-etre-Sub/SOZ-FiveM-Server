import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { SearchField } from '../../../ui/old_components/SearchField';
import { useMessageAPI } from '../hooks/useMessageAPI';

export const NewConversation = () => {
    const [t] = useTranslation();
    const { phoneNumber } = useParams<{ phoneNumber?: string }>();
    const navigate = useNavigate();
    const config = useConfig();

    const { getFilteredContacts } = useContact();
    const [searchValue, setSearchValue] = useState<string>('');
    const filteredContacts = useMemo(() => {
        return getFilteredContacts(searchValue);
    }, [getFilteredContacts, searchValue]);

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
            <AppContent>
                <SearchField
                    placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                    onChange={e => setSearchValue(e.target.value)}
                    value={searchValue}
                />
                <nav className="h-[740px] pb-10 overflow-y-auto" aria-label="Directory">
                    {Object.keys(filteredContacts)
                        .sort()
                        .map(letter => (
                            <div key={letter} className="relative">
                                <div
                                    className={cn('sticky top-0 pt-4 px-6 py-1 text-sm font-medium', {
                                        'bg-ios-800 text-gray-400': config.theme.value === 'dark',
                                        'bg-ios-50 text-gray-600': config.theme.value === 'light',
                                    })}
                                >
                                    <h3>{letter}</h3>
                                </div>
                                <ul
                                    className={cn('relative divide-y', {
                                        'divide-gray-700': config.theme.value === 'dark',
                                        'divide-gray-200': config.theme.value === 'light',
                                    })}
                                >
                                    {filteredContacts[letter].map(contact => (
                                        <li
                                            key={contact.id}
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
                                                <div className="flex-shrink-0">
                                                    <ContactPicture picture={contact.avatar} />
                                                </div>
                                                <div className="flex-1 min-w-0 cursor-pointer">
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
                                    ))}
                                </ul>
                            </div>
                        ))}
                </nav>
            </AppContent>
        </>
    );
};
