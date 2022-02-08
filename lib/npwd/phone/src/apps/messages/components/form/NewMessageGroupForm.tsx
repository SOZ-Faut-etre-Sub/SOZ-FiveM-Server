import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useContactActions} from '../../../contacts/hooks/useContactActions';
import {useFilteredContacts} from '../../../contacts/hooks/state';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/outline";
import {AppTitle} from "@ui/components/AppTitle";
import {Button} from "@ui/components/Button";
import {AppContent} from "@ui/components/AppContent";
import {ThemeContext} from "../../../../styles/themeProvider";

const NewMessageGroupForm = ({phoneNumber}: { phoneNumber?: string }) => {
    const history = useHistory();
    const {theme} = useContext(ThemeContext);
    const [, setParticipant] = useState<any>('');
    const [, setParticipantValue] = useState('');
    const {getContactByNumber} = useContactActions();
    const contacts = useFilteredContacts();
    const {addConversation} = useMessageAPI();

    useEffect(() => {
        if (phoneNumber) {
            const find = getContactByNumber(phoneNumber);
            if (find) {
                setParticipant(find);
                addConversation(phoneNumber);
            } else {
                setParticipantValue(phoneNumber);
            }
        }
    }, [phoneNumber, getContactByNumber, addConversation]);

    const handleCancel = () => {
        history.push('/messages');
    };

    return (
        <div className="mt-10">
            <AppTitle title="Contacts">
                <Button className="flex items-center text-base" onClick={handleCancel}>
                    <ChevronLeftIcon className="h-5 w-5"/> Fermer
                </Button>
            </AppTitle>
            <AppContent>
                <nav className="h-[780px] pb-10 overflow-y-auto" aria-label="Directory">
                    {Object.keys(contacts).sort().map((letter) => (
                        <div key={letter} className="relative">
                            <div className={`sticky top-0 pt-4 px-6 py-1 text-sm font-medium ${theme === 'dark' ? 'bg-black text-gray-400' : 'bg-[#F2F2F6] text-gray-600'}`}>
                                <h3>{letter}</h3>
                            </div>
                            <ul className={`relative divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {contacts[letter].map((contact) => (
                                    <li key={contact.id} className={`${theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'} w-full cursor-pointer`} onClick={() => addConversation(contact.number)}>
                                        <div className={`relative px-6 py-2 flex items-center space-x-3 ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-200'}`}>
                                            <div className="flex-shrink-0">
                                                {contact.avatar ? (
                                                    <img className={`h-10 w-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full`} src={contact.avatar} alt=""/>
                                                ) : (
                                                    <div className={`h-10 w-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full`}/>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 cursor-pointer">
                                                <span className="absolute inset-0" aria-hidden="true"/>
                                                <p className={`text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-600'}`}>{contact.display}</p>
                                            </div>
                                            <ChevronRightIcon className="h-5 w-5 text-gray-300"/>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </AppContent>
        </div>
    );
};

export default NewMessageGroupForm;
