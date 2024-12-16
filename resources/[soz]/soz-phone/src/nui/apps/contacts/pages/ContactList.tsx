import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { ChatIcon, PencilAltIcon, PhoneIcon } from '@heroicons/react/solid';
import { useApp } from '@os/apps/hooks/useApps';
import { useCall } from '@os/call/hooks/useCall';
import { AppContent } from '@ui/components/AppContent';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

import { ContactItemProps } from '../../../../../typings/app/contact';
import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { AppTitle } from '../../../ui/components/AppTitle';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { SearchField } from '../../../ui/components/SearchField';

const LIST_HEIGHT = 693;
const LIST_WIDTH = 380;
const LIST_ITEM_HEIGHT = 63;

export const ContactList: FunctionComponent<{ skipTitle?: boolean; isEmbeded?: boolean }> = ({
    skipTitle = false,
    isEmbeded = false,
}) => {
    const config = useConfig();
    const contactsApp = useApp('contacts');

    const { getFilteredContacts } = useContact();
    const [searchValue, setSearchValue] = useState<string>('');
    const filteredContacts = useMemo(() => {
        return getFilteredContacts(searchValue).sort((a, b) => a.display.localeCompare(b.display));
    }, [getFilteredContacts, searchValue]);

    const [t] = useTranslation();
    const navigate = useNavigate();

    const { pathname } = useLocation();
    const pathTemplate = /contacts\/-?\d/;

    return (
        <>
            {!skipTitle && (
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
            )}
            <AppContent aria-label="Directory" scrollable={false}>
                <div className="sticky top-0 z-10">
                    <SearchField
                        placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                        onChange={e => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </div>

                <ul
                    style={{ height: isEmbeded ? 'calc(100% - 7.5rem)' : 'calc(100% - 3.5rem)' }}
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

    const navigate = useNavigate();
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

    const contact = data[index];
    if (!contact) return null;

    return (
        <Menu
            as="li"
            style={style}
            className={cn('cursor-pointer', {
                'bg-ios-800': config.theme.value === 'dark',
                'bg-ios-50': config.theme.value === 'light',
            })}
        >
            <Menu.Button className="w-full">
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
                            className={cn('text-left text-sm font-medium truncate', {
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
                <Menu.Items className="mt-2 origin-top-right bg-ios-800 bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
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
    );
};
