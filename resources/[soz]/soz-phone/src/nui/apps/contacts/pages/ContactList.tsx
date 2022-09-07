import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { ChatIcon, PencilAltIcon, PhoneIcon } from '@heroicons/react/solid';
import { useApp } from '@os/apps/hooks/useApps';
import { useCall } from '@os/call/hooks/useCall';
import { AppContent } from '@ui/components/AppContent';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { AppTitle } from '../../../ui/components/AppTitle';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { SearchField } from '../../../ui/old_components/SearchField';

export const ContactList: React.FC = () => {
    const contactsApp = useApp('contacts');

    const [searchValue, setSearchValue] = useState<string>('');
    const contacts = useSelector((state: RootState) => state.simCard.contacts);
    const filteredContacts = useMemo(() => {
        const list = [];
        const regExp = new RegExp(searchValue.replace(/[^a-zA-Z\d]/g, ''), 'gi');

        contacts
            .filter(contact => contact?.display?.match(regExp) || contact.number.match(regExp))
            .forEach(contact => {
                const letter = (contact.display ? contact.display[0] : '#').toUpperCase();
                if (list[letter] === undefined) {
                    list[letter] = [];
                }
                list[letter].push(contact);
            });

        return list;
    }, [contacts, searchValue]);

    const [t] = useTranslation();
    const navigate = useNavigate();
    const config = useConfig();
    const { initializeCall } = useCall();

    const openContactInfo = (contactId: number) => {
        navigate(`/contacts/${contactId}`);
    };

    const startCall = (number: string) => {
        initializeCall(number);
    };

    const handleMessage = (phoneNumber: string) => {
        navigate(`/messages/new/${phoneNumber}`);
    };
    const { pathname } = useLocation();
    const pathTemplate = /contacts\/-?\d/;

    return (
        <>
            <AppTitle
                app={contactsApp}
                action={
                    !pathname.match(pathTemplate) && (
                        <PlusIcon className="h-6 w-6 cursor-pointer" onClick={() => navigate('/contacts/-1')} />
                    )
                }
            >
                <div />
            </AppTitle>
            <AppContent aria-label="Directory">
                <SearchField
                    placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                    onChange={e => setSearchValue(e.target.value)}
                    value={searchValue}
                />
                {Object.keys(filteredContacts)
                    .sort()
                    .map(letter => (
                        <div key={letter} className="relative">
                            <div
                                className={cn('sticky top-0 pt-4 px-6 py-1 text-sm font-medium', {
                                    'bg-black text-gray-400': config.theme.value === 'dark',
                                    'bg-ios-50 text-gray-600': config.theme.value === 'light',
                                })}
                            >
                                <h3 className="uppercase">{letter}</h3>
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
                                        <Menu
                                            key={contact.id}
                                            as="li"
                                            className={cn('w-full cursor-pointer', {
                                                'bg-black': config.theme.value === 'dark',
                                                'bg-ios-50': config.theme.value === 'light',
                                            })}
                                        >
                                            <Menu.Button className="w-full">
                                                <div
                                                    className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                                        'hover:bg-gray-900': config.theme.value === 'dark',
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
                                                </div>
                                            </Menu.Button>
                                            <Transition
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform scale-95 opacity-0"
                                                enterTo="transform scale-100 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform scale-100 opacity-100"
                                                leaveTo="transform scale-95 opacity-0"
                                                className="absolute z-50 right-0 w-56"
                                            >
                                                <Menu.Items className="mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                                    <Menu.Item>
                                                        <Button
                                                            className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                            onClick={() => startCall(contact.number)}
                                                        >
                                                            <PhoneIcon className="mx-3 h-5 w-5" /> Appeler
                                                        </Button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Button
                                                            className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                            onClick={() => handleMessage(contact.number)}
                                                        >
                                                            <ChatIcon className="mx-3 h-5 w-5" /> Message
                                                        </Button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Button
                                                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-500"
                                                            onClick={() => openContactInfo(contact.id)}
                                                        >
                                                            <PencilAltIcon className="mx-3 h-5 w-5" /> Éditer
                                                        </Button>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ))}
                            </ul>
                        </div>
                    ))}
            </AppContent>
        </>
    );
};
