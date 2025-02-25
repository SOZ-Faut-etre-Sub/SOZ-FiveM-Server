import { PlusIcon } from '@heroicons/react/outline';
import { ChatIcon, PencilAltIcon, PhoneIcon, StarIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { VariableSizeList } from 'react-window';

import { Contact, Separator } from '../../../../../../shared/phone/simcard';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { useCallAPI } from '../../../api/useCallAPI';
import { ContactPicture } from '../../../components/ContactPicture';
import { ListButton } from '../../../components/List';
import { SearchField } from '../../../components/SearchField';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useContacts } from '../../../system/sim-card/hooks/useContact';
import { useContactsAPI } from '../hooks/useContactsAPI';

export const LIST_ITEM_HEIGHT = 63;
export const LIST_ITEM_SEPARATOR_HEIGHT = 35;

export const ContactList: FunctionComponent<{ isEmbeded?: boolean }> = ({ isEmbeded = false }) => {
    const ref = useRef<VariableSizeList>(null);
    const contactsApp = useApp('contacts');

    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeConfig();

    const { contacts, searchValue, setSearchValue } = useContacts();

    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <PlusIcon className="cursor-pointer size-5" />,
            onClick: () => navigate('/contacts/-1'),
        },
    ]);

    useEffect(() => {
        ref.current.resetAfterIndex(0, true);
    }, [contacts]);

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle app={contactsApp} />
                <div className="sticky top-0 z-10">
                    <SearchField onChange={e => setSearchValue(e.target.value)} value={searchValue} />
                </div>

                {contacts && contacts.length > 0 ? (
                    <VariableSizeList
                        ref={ref}
                        height={720 - (isEmbeded ? 50 : 0)}
                        width={410}
                        itemSize={(index: number) =>
                            'separator' in contacts[index] ? LIST_ITEM_SEPARATOR_HEIGHT : LIST_ITEM_HEIGHT
                        }
                        itemCount={contacts.length}
                        itemData={contacts}
                        className={clsx(
                            'rounded-xl scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                            {
                                'scrollbar-thumb-white/80': theme === 'dark',
                                'scrollbar-thumb-black/20': theme === 'light',
                            }
                        )}
                    >
                        {ContactItem}
                    </VariableSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('CONTACTS.FEEDBACK.NO_CONTACTS')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const ContactItem: FunctionComponent<VirtualizedListProps<Contact | Separator>> = ({ index, style, data }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const theme = useThemeConfig();
    const { initializeCall } = useCallAPI();
    const { addFavoriteContact, removeFavoriteContact } = useContactsAPI();

    const openContactInfo = (contactId: number) => navigate(`/contacts/${contactId}`);
    const startCall = (number: string) => initializeCall(number);
    const handleMessage = (phoneNumber: string) => navigate(`/messages/new/${phoneNumber}`);

    const contact = data[index];
    if (!contact) return null;

    if ('separator' in contact) {
        return (
            <div
                style={style}
                className={clsx('px-6 py-2 text-sm font-medium', {
                    'bg-ios-800 text-gray-400': theme === 'dark',
                    'bg-ios-50 text-gray-600': theme === 'light',
                })}
            >
                <h3 className="uppercase">{contact.display}</h3>
            </div>
        );
    }

    return (
        <ListButton
            key={contact.id}
            style={style}
            actions={[
                {
                    label: 'Retirer',
                    color: 'bg-gray-500 text-yellow-300',
                    icon: StarIcon,
                    onClick: () => removeFavoriteContact(contact.id),
                    condition: Boolean(contact.favorite),
                },
                {
                    label: 'Ajouter',
                    color: 'bg-gray-500 text-yellow-300',
                    icon: StarIcon,
                    onClick: () => addFavoriteContact(contact.id),
                    condition: !contact.favorite,
                },
                {
                    label: t('GENERIC_EDIT'),
                    color: 'bg-gray-500 text-white',
                    icon: PencilAltIcon,
                    onClick: () => openContactInfo(contact.id),
                },
                {
                    label: t('GENERIC_MESSAGE'),
                    color: 'bg-blue-500 text-white',
                    icon: ChatIcon,
                    onClick: () => handleMessage(contact.number),
                },
                {
                    label: 'Appeler',
                    color: 'bg-green-500 text-white',
                    icon: PhoneIcon,
                    onClick: () => startCall(contact.number),
                },
            ]}
        >
            <div
                className={clsx('flex-1 min-w-0 px-6 py-2 flex items-center space-x-3', {
                    'bg-phone-900 hover:bg-ios-600': theme === 'dark',
                    'bg-white hover:bg-gray-200': theme === 'light',
                })}
            >
                <div className="relative flex-shrink-0">
                    <ContactPicture picture={contact.avatar} />
                    {Boolean(contact.favorite) && (
                        <StarIcon className="absolute right-0 top-0 size-4 text-yellow-500 translate-x-1/4" />
                    )}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p
                        className={clsx('text-left text-sm font-medium truncate', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-600': theme === 'light',
                        })}
                    >
                        {contact.display}
                    </p>
                </div>
            </div>
        </ListButton>
    );
};
