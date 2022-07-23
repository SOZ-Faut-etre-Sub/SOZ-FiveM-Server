import { useQueryParams } from '@common/hooks/useQueryParams';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { ChatIcon, LocationMarkerIcon, PhoneIncomingIcon, PhoneMissedCallIcon } from '@heroicons/react/solid';
import { SocietiesDatabaseLimits } from '@typings/society';
import { AppTitle } from '@ui/components/AppTitle';
import { ActionButton } from '@ui/old_components/ActionButton';
import { AppContent } from '@ui/old_components/AppContent';
import { Button } from '@ui/old_components/Button';
import { TextareaField } from '@ui/old_components/Input';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { AppWrapper } from '../../../../ui/components/AppWrapper';
import { useContactActions } from '../../hooks/useContactActions';
import { useContactsAPI } from '../../hooks/useContactsAPI';

interface ContactInfoRouteQuery {
    addNumber?: string;
    referal?: string;
    name?: string;
    avatar?: string;
}

const ContactsInfoPage: React.FC = () => {
    const { id } = useParams();
    const { referal: referral } = useQueryParams<ContactInfoRouteQuery>({
        referal: '/society-contacts',
    });

    const navigate = useNavigate();

    const { getContact } = useContactActions();
    const { sendSocietyMessage } = useContactsAPI();
    const contact = getContact(parseInt(id));

    const [t] = useTranslation();
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === SocietiesDatabaseLimits.message) return;
        setMessage(e.target.value);
    };

    const handleAnonymousChange: React.MouseEventHandler<HTMLInputElement> = () => {
        setAnonymous(s => !s);
    };

    const handleSend = () => {
        if (message.length > 5)
            sendSocietyMessage({ number: contact.number, message, anonymous, position: false }, referral);
    };

    const handleSendWithLocation = () => {
        if (message.length > 5)
            sendSocietyMessage({ number: contact.number, message, anonymous, position: true }, referral);
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
            <AppWrapper>
                <AppTitle title={contact.display}>
                    <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                        <ChevronLeftIcon className="h-5 w-5" />
                        Fermer
                    </Button>
                </AppTitle>
                <AppContent className="text-white mt-10 mx-4 mb-4">
                    <div className="flex justify-center">
                        <div
                            className="bg-gray-700 bg-cover bg-center h-20 w-20 my-1 rounded-full"
                            style={{ backgroundImage: `url(${contact.avatar})` }}
                        />
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
                    <div className="mt-4 grid gap-3 grid-cols-3">
                        <ActionButton onClick={handleSend} disabled={message.length < 3}>
                            <ChatIcon className="h-6 w-6" />
                            <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND')}</p>
                        </ActionButton>

                        <ActionButton onClick={handleAnonymousChange}>
                            {anonymous ? (
                                <PhoneMissedCallIcon className="h-6 w-6" />
                            ) : (
                                <PhoneIncomingIcon className="h-6 w-6" />
                            )}
                            <p className="text-sm text-center">Rappel {anonymous ? 'interdit' : 'autorisé'}</p>
                        </ActionButton>

                        <ActionButton onClick={handleSendWithLocation} disabled={message.length < 3}>
                            <LocationMarkerIcon className="h-6 w-6" />
                            <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND_POSITION')}</p>
                        </ActionButton>
                    </div>
                    {message.length < 3 && (
                        <p className="text-sm text-center text-red-500 pt-2">Votre message est trop court</p>
                    )}
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};

export default ContactsInfoPage;
