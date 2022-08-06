import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { Button } from '@ui/old_components/Button';
import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { RootState } from '../../../store';
import { ThemeContext } from '../../../styles/themeProvider';
import { useMessageAPI } from '../hooks/useMessageAPI';

export const NewConversation = () => {
    const { phoneNumber } = useQueryParams<{ phoneNumber?: string }>();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
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
    }, [phoneNumber, addConversation]);

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
                                            onClick={() => addConversation(contact.number)}
                                        >
                                            <div
                                                className={`relative px-6 py-2 flex items-center space-x-3 ${
                                                    theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    {contact.avatar ? (
                                                        <img
                                                            className={`h-10 w-10 ${
                                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                                            } rounded-full`}
                                                            src={contact.avatar}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`h-10 w-10 ${
                                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                                            } rounded-full`}
                                                        />
                                                    )}
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
