import React from 'react';
import {SearchContacts} from './SearchContacts';
import {useHistory} from 'react-router-dom';
import {useFilteredContacts} from '../../hooks/state';

export const ContactList: React.FC = () => {
    const filteredContacts = useFilteredContacts();
    const history = useHistory();

    const openContactInfo = (contactId: number) => {
        history.push(`/society-contacts/${contactId}`);
    };

    return (
        <div className="mt-5">
            <SearchContacts/>
            <nav className="h-[780px] pb-10 overflow-y-auto" aria-label="Directory">
                {Object.keys(filteredContacts).sort().map((letter) => (
                    <div key={letter} className="relative">
                        <div className="sticky top-0 pt-4 bg-black px-6 py-1 text-sm font-medium text-gray-400">
                            <h3>{letter}</h3>
                        </div>
                        <ul className="relative divide-y divide-gray-700">
                            {filteredContacts[letter].map((contact) => (
                                <li key={contact.id} className="bg-black w-full cursor-pointer" onClick={() => openContactInfo(contact.id)}>
                                    <div className="relative px-6 py-2 flex items-center space-x-3 hover:bg-gray-900">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 bg-gray-700 rounded-full" src={contact.avatar} alt=""/>
                                        </div>
                                        <div className="flex-1 min-w-0 cursor-pointer">
                                            <span className="absolute inset-0" aria-hidden="true"/>
                                            <p className="text-left text-sm font-medium text-gray-100">{contact.display}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    );
};
