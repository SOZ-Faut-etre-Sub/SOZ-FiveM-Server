import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { RootState } from '../../../store';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useMessageAPI } from '../hooks/useMessageAPI';

export const NewConversation = () => {
    const { phoneNumber } = useParams<{ phoneNumber?: string }>();
    const navigate = useNavigate();
    const config = useConfig();

    const contacts = useSelector((state: RootState) => state.simCard.contacts);
    const filteredContacts = useMemo(() => {
        const list = [];
        contacts.forEach(contact => {
            if (list[contact.display[0]] === undefined) {
                list[contact.display[0]] = [];
            }
            list[contact.display[0]].push(contact);
        });

        return list;
    }, [contacts]);

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
