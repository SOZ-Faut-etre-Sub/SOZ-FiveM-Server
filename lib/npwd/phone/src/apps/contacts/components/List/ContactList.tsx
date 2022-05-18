import React, {useContext} from 'react';
import {SearchContacts} from './SearchContacts';
import {useHistory} from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import {useFilteredContacts} from '../../hooks/state';
import {useCall} from '@os/call/hooks/useCall';
import {Menu, Transition} from "@headlessui/react";
import {Button} from "@ui/components/Button";
import {ChatIcon, PencilAltIcon, PhoneIcon} from "@heroicons/react/solid";
import {ThemeContext} from "../../../../styles/themeProvider";


export const ContactList: React.FC = () => {
    const filteredContacts = useFilteredContacts();
    const history = useHistory();
    const {theme} = useContext(ThemeContext);
    const {initializeCall} = useCall();

    const openContactInfo = (contactId: number) => {
        history.push(`/contacts/${contactId}`);
    };

    const startCall = (number: string) => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(number);
    };

    const handleMessage = (phoneNumber: string) => {
        LogDebugEvent({
            action: 'Routing to Message',
            level: 1,
            data: {phoneNumber},
        });
        history.push(`/messages/new?phoneNumber=${phoneNumber}`);
    };

    return (
        <div className="mt-5">
            <SearchContacts/>
            <nav className="h-[740px] pb-10 overflow-y-auto" aria-label="Directory">
                {Object.keys(filteredContacts).sort().map((letter) => (
                    <div key={letter} className="relative">
                        <div className={`sticky top-0 pt-4 px-6 py-1 text-sm font-medium ${theme === 'dark' ? 'bg-black text-gray-400' : 'bg-[#F2F2F6] text-gray-600'}`}>
                            <h3>{letter}</h3>
                        </div>
                        <ul className={`relative divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredContacts[letter].map((contact) => (
                                <Menu key={contact.id} as="li" className={`${theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'} w-full cursor-pointer`}>
                                    <Menu.Button className="w-full">
                                        <div className={`relative px-6 py-2 flex items-center space-x-3 ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'}`}>
                                            <div className="flex-shrink-0">
                                                <div className={`h-10 w-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} bg-cover bg-center rounded-full`} style={{backgroundImage: `url(${contact.avatar})`}}/>
                                            </div>
                                            <div className="flex-1 min-w-0 cursor-pointer">
                                                <span className="absolute inset-0" aria-hidden="true"/>
                                                <p className={`text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-600'}`}>{contact.display}</p>
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
                                    >
                                        <Menu.Items
                                            className="absolute z-30 right-0 w-56 mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                            <Menu.Item>
                                                <Button
                                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                    onClick={() => startCall(contact.number)}
                                                >
                                                    <PhoneIcon className="mx-3 h-5 w-5"/> Appeler
                                                </Button>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Button
                                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                    onClick={() => handleMessage(contact.number)}
                                                >
                                                    <ChatIcon className="mx-3 h-5 w-5"/> Message
                                                </Button>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Button
                                                    className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-500"
                                                    onClick={() => openContactInfo(contact.id)}
                                                >
                                                    <PencilAltIcon className="mx-3 h-5 w-5"/> Éditer
                                                </Button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    );
};
