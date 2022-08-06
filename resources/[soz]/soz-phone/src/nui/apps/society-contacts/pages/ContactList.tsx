import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSociety } from '../../../hooks/app/useSociety';
import { useApp } from '../../../os/apps/hooks/useApps';
import { ThemeContext } from '../../../styles/themeProvider';
import { SearchField } from '../../../ui/old_components/SearchField';

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
    const { theme } = useContext(ThemeContext);
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
            <nav className="h-[740px] pb-10 overflow-y-auto" aria-label="Directory">
                {Object.keys(filteredContacts)
                    .sort()
                    .map(letter => (
                        <div key={letter} className="relative">
                            <div
                                className={`sticky top-0 pt-4 px-6 py-1 text-sm font-medium ${
                                    theme === 'dark' ? 'bg-black text-gray-400' : 'bg-ios-50 text-gray-600'
                                }`}
                            >
                                <h3>{letter}</h3>
                            </div>
                            <ul
                                className={`relative divide-y ${
                                    theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                                }`}
                            >
                                {filteredContacts[letter].map(contact => (
                                    <li
                                        key={contact.id}
                                        className={`${
                                            theme === 'dark' ? 'bg-black' : 'bg-ios-50'
                                        } w-full cursor-pointer`}
                                        onClick={() => openContactInfo(contact.id)}
                                    >
                                        <div
                                            className={`relative px-6 py-2 flex items-center space-x-3 ${
                                                theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'
                                            }`}
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    className={`h-10 w-10 ${
                                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                                    } rounded-full`}
                                                    src={contact.avatar}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 cursor-pointer">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                <p
                                                    className={`text-left text-sm font-medium ${
                                                        theme === 'dark' ? 'text-gray-100' : 'text-gray-600'
                                                    }`}
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
