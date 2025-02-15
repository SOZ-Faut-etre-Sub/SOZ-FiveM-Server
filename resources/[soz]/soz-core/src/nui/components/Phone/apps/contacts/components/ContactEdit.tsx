import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { ChatIcon, PhoneIcon, StarIcon, TrashIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useCallAPI } from '../../../api/useCallAPI';
import SaveIcon from '../../../assets/save.svg';
import { ActionButton } from '../../../components/ActionButton';
import { ContactPicture } from '../../../components/ContactPicture';
import { NumberField, TextField } from '../../../components/Input';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useAlert } from '../../../system/alerts/hooks/useAlert';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useAppTitleUpdater } from '../../../system/apps/hooks/useAppTitleUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useContactByID } from '../../../system/sim-card/hooks/useContact';
import { useContactsAPI } from '../hooks/useContactsAPI';

interface ContactInfoRouteQuery {
    addNumber?: string;
    referral?: string;
    name?: string;
    avatar?: string;
}

export const ContactEdit: FunctionComponent = () => {
    const contactsApp = useApp('contacts');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useThemeConfig();
    const { sendAlert } = useAlert();

    const { id } = useParams();
    const {
        addNumber,
        referral: referral,
        avatar: avatarParam,
        name: nameParam,
    } = useQueryParams<ContactInfoRouteQuery>({
        referral: '/contacts',
    });

    const { updateContact, addNewContact, deleteContact, addFavoriteContact, removeFavoriteContact } = useContactsAPI();

    const contact = useContactByID(parseInt(id));

    const [name, setName] = useState(() => contact?.display || '');
    const [number, setNumber] = useState(() => contact?.number || '');
    const [avatar, setAvatar] = useState(() => contact?.avatar || '');

    const { initializeCall } = useCallAPI();

    const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === 20) return;
        setNumber(e.target.value);
    };

    const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === 255) return;
        setName(e.target.value);
    };

    const handleContactCall = () => initializeCall(contact.number);

    const handleContactMessage = () => navigate(`/messages/new/${contact.number}`);

    const handleContactAdd = () => addNewContact({ display: name, number }, referral);

    const handleContactDelete = () => {
        sendAlert('Supprimer le contact ?', t('GENERIC.DELETE_CONFIRM_CONTENT'), () => {
            deleteContact(contact.id);
        });
    };

    const handleContactUpdate = () => {
        updateContact(contact.id, { number, display: name });
    };

    useAppTitleUpdater(true, t(contactsApp.nameLocale));
    useAppTitleGetBackUpdater(() => navigate(-1));
    useAppTitleActionsUpdater([
        {
            display: Boolean(contact),
            icon: <TrashIcon className="size-5" />,
            className: 'text-red-400 hover:text-red-500',
            onClick: handleContactDelete,
        },
        {
            display: Boolean(contact?.favorite),
            icon: <StarIcon className="size-5" />,
            className: 'text-yellow-500 hover:text-yellow-600',
            onClick: () => removeFavoriteContact(contact?.id),
        },
        {
            display: !contact?.favorite,
            icon: <StarIconOutline className="size-5" />,
            className: 'text-yellow-500 hover:text-yellow-600',
            onClick: () => addFavoriteContact(contact?.id),
        },
        {
            display: true,
            icon: <SaveIcon className="size-5" />,
            className: {
                'text-ios-100 hover:text-ios-200': theme === 'dark',
                'text-ios-700 hover:text-ios-600': theme === 'light',
            },
            onClick: contact ? handleContactUpdate : handleContactAdd,
        },
    ]);

    useEffect(() => {
        if (addNumber) setNumber(addNumber);
        if (avatarParam) setAvatar(avatarParam);
        if (nameParam) setName(nameParam);
    }, [addNumber, avatar, avatarParam, nameParam]);

    return (
        <AppWrapper>
            <AppContent>
                <div className="flex flex-col justify-center items-center gap-2 truncate">
                    <ContactPicture picture={avatar} size="large" />
                    <p
                        className={clsx('font-semibold text-xl', {
                            'text-gray-200': theme === 'dark',
                            'text-black': theme === 'light',
                        })}
                    >
                        {name}
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <ActionButton onClick={handleContactMessage}>
                        <ChatIcon className="size-6" />
                        <p className="text-sm">Message</p>
                    </ActionButton>
                    <ActionButton onClick={handleContactCall}>
                        <PhoneIcon className="size-6" />
                        <p className="text-sm">Appeler</p>
                    </ActionButton>
                </div>

                <div className="flex flex-col gap-4 mt-12">
                    <div
                        className={clsx('rounded-lg', {
                            'bg-ios-700': theme === 'dark',
                            'bg-ios-50': theme === 'light',
                        })}
                    >
                        <p className="text-sm text-[#347DD9] pl-3">{t('CONTACTS.FORM_NAME')}</p>
                        <TextField placeholder={t('CONTACTS.FORM_NAME')} value={name} onChange={handleDisplayChange} />
                    </div>

                    <div
                        className={clsx('rounded-lg', {
                            'bg-ios-700': theme === 'dark',
                            'bg-ios-50': theme === 'light',
                        })}
                    >
                        <p className="text-sm text-[#347DD9] pl-3">{t('CONTACTS.FORM_NUMBER')}</p>
                        <NumberField format="555-####" value={number} onChange={handleNumberChange} />
                    </div>
                </div>
            </AppContent>
        </AppWrapper>
    );
};
