import { PlusIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { VariableSizeList } from 'react-window';

import { SocietyContact } from '../../../../../../shared/phone/apps/society';
import { Separator } from '../../../../../../shared/phone/simcard';
import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { useAssetPath } from '../../../../../hook/assets';
import { ContactPicture } from '../../../components/ContactPicture';
import { ListItem } from '../../../components/List';
import { SearchField } from '../../../components/SearchField';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useSocietyContacts } from '../hooks/useContact';

export const LIST_ITEM_HEIGHT = 63;
export const LIST_ITEM_SEPARATOR_HEIGHT = 35;

export const ContactList: FunctionComponent = () => {
    const { t } = useTranslation();
    const contactsApp = useApp('society-contacts');

    const theme = useThemeConfig();

    const { contacts, searchValue, setSearchValue } = useSocietyContacts();

    return (
        <AppWrapper>
            <AppContent>
                <AppTitle app={contactsApp} />
                <div className="sticky top-0 z-10">
                    <SearchField onChange={e => setSearchValue(e.target.value)} value={searchValue} />
                </div>

                {contacts && contacts.length > 0 ? (
                    <VariableSizeList
                        height={720}
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

const ContactItem: FunctionComponent<VirtualizedListProps<SocietyContact | Separator>> = ({ index, style, data }) => {
    const navigate = useNavigate();
    const theme = useThemeConfig();

    const { getPath } = useAssetPath();

    const contact = data[index];
    if (!contact) return null;

    if ('separator' in contact) {
        return (
            <div
                key={index}
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
        <ListItem key={index} style={style} onClick={() => navigate(`/society-contacts/${contact.number}`)}>
            <div
                className={clsx('flex-1 min-w-0 px-6 py-2 flex items-center space-x-3', {
                    'bg-phone-900 hover:bg-ios-600': theme === 'dark',
                    'bg-white hover:bg-gray-200': theme === 'light',
                })}
            >
                <div className="relative flex-shrink-0">
                    <ContactPicture picture={getPath('images/society/' + contact.avatar)} useOffset={false} />
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
        </ListItem>
    );
};
