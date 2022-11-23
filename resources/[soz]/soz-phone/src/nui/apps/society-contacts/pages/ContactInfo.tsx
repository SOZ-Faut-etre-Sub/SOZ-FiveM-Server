import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { ChatIcon } from '@heroicons/react/solid';
import { SocietiesDatabaseLimits } from '@typings/society';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { ActionButton } from '@ui/old_components/ActionButton';
import { Button } from '@ui/old_components/Button';
import { TextareaField } from '@ui/old_components/Input';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useSociety } from '../../../hooks/app/useSociety';
import { Checkbox } from '../../../ui/components/Checkbox';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useContactsAPI } from '../hooks/useContactsAPI';

const ContactsInfoPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getContact } = useSociety();
    const { sendSocietyMessage } = useContactsAPI();
    const contact = getContact(parseInt(id));

    const [t] = useTranslation();
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [position, setPosition] = useState(true);

    const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === SocietiesDatabaseLimits.message) return;
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.length >= 5) {
            sendSocietyMessage({ number: contact.number, message, anonymous, position: false });
            navigate('/society-contacts', { replace: true });
        }
    };

    const handleSendWithLocation = () => {
        if (message.length >= 5) {
            sendSocietyMessage({ number: contact.number, message, anonymous, position: true });
            navigate('/society-contacts', { replace: true });
        }
    };

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppTitle title={contact.display}>
                <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                    <ChevronLeftIcon className="h-5 w-5" />
                    Fermer
                </Button>
            </AppTitle>
            <AppContent className="text-white mt-10 mb-4">
                <div className="flex justify-center">
                    <ContactPicture picture={contact.avatar} useOffset={false} size="large" />
                </div>
                <div>
                    <TextareaField
                        value={message}
                        rows={14}
                        variant="outlined"
                        onChange={handleNumberChange}
                        placeholder={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
                    />
                </div>
                <div className="mx-10">
                    <Checkbox
                        title="Envoyer avec ma position"
                        enabled={position}
                        onClick={() => setPosition(s => !s)}
                    />
                    <Checkbox title="Envoi anonyme" enabled={anonymous} onClick={() => setAnonymous(s => !s)} />
                </div>
                <div className="mt-2 mx-10">
                    <ActionButton onClick={handleSend} disabled={message.length < 5}>
                        <ChatIcon className="h-6 w-6" />
                        {message.length < 5 ? (
                            <p className="text-sm text-center text-gray-500">Votre message est trop court</p>
                        ) : (
                            <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND')}</p>
                        )}
                    </ActionButton>
                </div>
            </AppContent>
        </Transition>
    );
};

export default ContactsInfoPage;
