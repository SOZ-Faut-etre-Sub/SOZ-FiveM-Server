import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import cn from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSociety } from '../../../hooks/app/useSociety';
import { useConfig } from '../../../hooks/usePhone';
import { useApp } from '../../../os/apps/hooks/useApps';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { SearchField } from '../../../ui/components/SearchField';

export const ContactList: React.FC = () => {
    const contactsApp = useApp('society-contacts');

    const { getContacts } = useSociety();
    const [searchValue, setSearchValue] = useState<string>('');
    const contacts = getContacts();
    const filteredContacts = useMemo(() => {
        const list = [];
        const regExp = new RegExp(searchValue.replace(/[^a-zA-Z\d]/g, ''), 'gi');

        contacts
            .filter(contact => contact?.display?.match(regExp) || contact.number.match(regExp))
            .forEach(contact => {
                if (list[contact.display[0]] === undefined) {
                    list[contact.display[0]] = [];
                }
                list[contact.display[0]].push(contact);
            });

        return list;
    }, [contacts, searchValue]);

    const [t] = useTranslation();
    const config = useConfig();
    const navigate = useNavigate();

    const openContactInfo = (contactId: number) => {
        navigate(`/society-contacts/${contactId}`);
    };

    return (
        <AppContent scrollable={false}>
            <AppTitle app={contactsApp} />
            <SearchField
                onChange={e => setSearchValue(e.target.value)}
                placeholder={t('SOCIETY_CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                value={searchValue}
            />
            <nav className="h-[725px] pb-10 overflow-y-auto" aria-label="Directory">
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
                                {filteredContacts[letter]
                                    .sort((a, b) => a.display.localeCompare(b.display))
                                    .map(contact => (
                                        <li
                                            key={contact.number}
                                            className={cn('w-full cursor-pointer', {
                                                'bg-ios-800': config.theme.value === 'dark',
                                                'bg-ios-50': config.theme.value === 'light',
                                            })}
                                            onClick={() => openContactInfo(contact.id)}
                                        >
                                            <div
                                                className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                                    'hover:bg-ios-600': config.theme.value === 'dark',
                                                    'hover:bg-gray-200': config.theme.value === 'light',
                                                })}
                                            >
                                                <div className="flex-shrink-0">
                                                    <ContactPicture picture={contact.avatar} useOffset={false} />
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
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
            </nav>
        </AppContent>
    );
};
