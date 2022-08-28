import { useQueryParams } from '@common/hooks/useQueryParams';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/outline';
import { ChatIcon, PencilAltIcon, PhoneIcon, TrashIcon } from '@heroicons/react/solid';
import { useApp } from '@os/apps/hooks/useApps';
import { useCall } from '@os/call/hooks/useCall';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { ContactsDatabaseLimits } from '@typings/contact';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { ActionButton } from '@ui/old_components/ActionButton';
import { Button } from '@ui/old_components/Button';
import { TextField } from '@ui/old_components/Input';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useContactsAPI } from '../hooks/useContactsAPI';

interface ContactInfoRouteQuery {
    addNumber?: string;
    referral?: string;
    name?: string;
    avatar?: string;
}

const ContactsInfoPage: React.FC = () => {
    const contacts = useApp('contacts');
    const navigate = useNavigate();
    const config = useConfig();
    const { id } = useParams();
    const {
        addNumber,
        referral: referral,
        avatar: avatarParam,
        name: nameParam,
    } = useQueryParams<ContactInfoRouteQuery>({
        referral: '/contacts',
    });

    const { getContact } = useContact();
    const { updateContact, addNewContact, deleteContact } = useContactsAPI();

    const contact = getContact(parseInt(id));

    const [name, setName] = useState(() => contact?.display || '');
    const [number, setNumber] = useState(() => contact?.number || '555-');
    const [avatar, setAvatar] = useState(() => contact?.avatar || '');
    // Set state after checking if null

    const { initializeCall } = useCall();
    const [t] = useTranslation();

    const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === ContactsDatabaseLimits.number) return;
        setNumber(e.target.value);
    };

    const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === ContactsDatabaseLimits.display) return;
        setName(e.target.value);
    };

    const handleContactCall = () => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(contact.number);
    };
    const handleContactMessage = () => {
        navigate(`/messages/new/${contact.number}`);
    };
    const handleContactAdd = () => {
        addNewContact({ display: name, number, avatar }, referral);
    };

    const handleContactDelete = () => {
        deleteContact({ id: contact.id });
    };

    const handleContactUpdate = () => {
        updateContact({ id: contact.id, number, avatar, display: name });
    };

    useEffect(() => {
        if (addNumber) setNumber(addNumber);
        if (avatarParam) setAvatar(avatarParam);
        if (nameParam) setName(nameParam);
    }, [addNumber, avatar, avatarParam, nameParam]);

    return (
        <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppWrapper>
                <AppTitle app={contacts}>
                    <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                        <ChevronLeftIcon className="h-5 w-5" />
                        Fermer
                    </Button>
                </AppTitle>
                <AppContent>
                    <div className="flex justify-center">
                        <ContactPicture picture={avatar} size="large" />
                    </div>
                    <div className={`mt-4 grid gap-3 ${contact ? 'grid-cols-4' : 'grid-cols-3'}`}>
                        <ActionButton onClick={handleContactCall}>
                            <PhoneIcon className="h-6 w-6" />
                            <p className="text-sm">Appeler</p>
                        </ActionButton>
                        <ActionButton onClick={handleContactMessage}>
                            <ChatIcon className="h-6 w-6" />
                            <p className="text-sm">Message</p>
                        </ActionButton>
                        {contact ? (
                            <>
                                <ActionButton onClick={handleContactUpdate}>
                                    <PencilAltIcon className="h-6 w-6" />
                                    <p className="text-sm">Éditer</p>
                                </ActionButton>
                                <div
                                    className={cn(
                                        'flex flex-col justify-center items-center text-red-500 rounded-xl p-3 cursor-pointer',
                                        {
                                            'bg-[#1C1C1E]': config.theme.value === 'dark',
                                            'bg-white': config.theme.value === 'light',
                                        }
                                    )}
                                    onClick={handleContactDelete}
                                >
                                    <TrashIcon className="h-6 w-6" />
                                    <p className="text-sm">Supprimer</p>
                                </div>
                            </>
                        ) : (
                            <ActionButton onClick={handleContactAdd}>
                                <PlusIcon className="h-6 w-6" />
                                <p className="text-sm">Ajouter</p>
                            </ActionButton>
                        )}
                    </div>
                    <div className="mt-6">
                        <div
                            className={cn('rounded-lg my-2', {
                                'bg-[#1C1C1E]': config.theme.value === 'dark',
                                'bg-ios-50': config.theme.value === 'light',
                            })}
                        >
                            <p className="text-sm text-[#347DD9] pl-5 pt-2">{t('CONTACTS.FORM_NAME')}</p>
                            <TextField
                                placeholder={t('CONTACTS.FORM_NAME')}
                                value={name}
                                onChange={handleDisplayChange}
                            />
                        </div>
                        <div
                            className={cn('rounded-lg my-2', {
                                'bg-[#1C1C1E]': config.theme.value === 'dark',
                                'bg-ios-50': config.theme.value === 'light',
                            })}
                        >
                            <p className="text-sm text-[#347DD9] pl-5 pt-2">{t('CONTACTS.FORM_NUMBER')}</p>
                            <NumberFormat
                                className={cn('w-full rounded-lg py-1 px-3 focus:bg-opacity-70 focus:outline-none', {
                                    'bg-[#1C1C1E] text-white': config.theme.value === 'dark',
                                    'bg-gray-300 text-black': config.theme.value === 'light',
                                })}
                                format="###-####"
                                defaultValue="555-"
                                value={number}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};

export default ContactsInfoPage;
