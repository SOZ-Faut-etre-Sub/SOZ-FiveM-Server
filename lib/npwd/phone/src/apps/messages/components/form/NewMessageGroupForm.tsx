import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useContactActions} from '../../../contacts/hooks/useContactActions';
import {TextField} from '@ui/components/Input';
import {useFilteredContacts} from '../../../contacts/hooks/state';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/outline";
import {AppTitle} from "@ui/components/AppTitle";
import {Button} from "@ui/components/Button";
import {AppContent} from "@ui/components/AppContent";

const NewMessageGroupForm = ({phoneNumber}: { phoneNumber?: string }) => {
    const history = useHistory();
    const [t] = useTranslation();
    const [participant, setParticipant] = useState<any>('');
    const [participantValue, setParticipantValue] = useState('');
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

    const handleSubmit = () => {
        if (participantValue || participant) {
            const targetNumber = participant.number ?? participantValue;
            addConversation(targetNumber);
        }
    };

    const handleCancel = () => {
        history.push('/messages');
    };

    const renderAutocompleteInput = (params) => (
        <TextField
            {...params}
            label={t('MESSAGES.INPUT_NAME_OR_NUMBER')}
            onChange={(e) => setParticipant(e.currentTarget.value)}
        />
    );

    const submitDisabled = !participantValue && !participant;

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
                            <div className="sticky top-0 pt-4 bg-black px-6 py-1 text-sm font-medium text-gray-400">
                                <h3>{letter}</h3>
                            </div>
                            <ul role="list" className="relative divide-y divide-gray-700">
                                {contacts[letter].map((contact) => (
                                    <li key={contact.id} className="bg-black w-full" onClick={() => addConversation(contact.number)}>
                                        <div className="relative px-6 py-2 flex items-center space-x-3 hover:bg-gray-900">
                                            <div className="flex-shrink-0">
                                                {contact.avatar ? (
                                                    <img className="h-10 w-10 bg-gray-700 rounded-full" src={contact.avatar} alt=""/>
                                                ) : (
                                                    <div className="h-10 w-10 bg-gray-700 rounded-full"/>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 cursor-pointer">
                                                <span className="absolute inset-0" aria-hidden="true"/>
                                                <p className="text-left text-sm font-medium text-gray-100">{contact.display}</p>
                                            </div>
                                            <ChevronRightIcon className="h-5 w-5 text-white text-opacity-25"/>
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
