import {
    ChatIcon,
    PhoneIcon,
    PhoneIncomingIcon,
    PhoneMissedCallIcon,
    PhoneOutgoingIcon,
    UserAddIcon,
} from '@heroicons/react/solid';
import { CallHistory } from '@public/shared/phone/simcard';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

import { VirtualizedListProps } from '../../../../../../shared/virtualized';
import { useCallAPI } from '../../../api/useCallAPI';
import { ContactPicture } from '../../../components/ContactPicture';
import { DayAgo } from '../../../components/DayAgo';
import { ListButton } from '../../../components/List';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useCall } from '../../../system/sim-card/hooks/useCall';
import { useContact } from '../../../system/sim-card/hooks/useContact';
import { useSimCard } from '../../../system/sim-card/hooks/useSimCard';

export const DialerHistory: React.FC = () => {
    const { t } = useTranslation();

    const dialerApp = useApp('dialer');

    const { calls } = useCall();

    const theme = useThemeConfig();

    if (calls.length === 0) {
        return (
            <div
                className={clsx('flex h-full justify-center items-center text-white', {
                    'text-gray-100': theme === 'dark',
                    'text-gray-600': theme === 'light',
                })}
            >
                <p>{t('DIALER.NO_HISTORY')}</p>
            </div>
        );
    }

    return (
        <AppWrapper>
            <AppContent className="pb-5">
                <AppTitle app={dialerApp} />

                {calls && calls.length > 0 ? (
                    <FixedSizeList
                        height={710}
                        width={410}
                        itemSize={60}
                        itemCount={calls.length}
                        itemData={calls.sort((a, b) => b.start - a.start)}
                        className={clsx(
                            'mt-2 rounded-xl scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                            {
                                'scrollbar-thumb-white/80': theme === 'dark',
                                'scrollbar-thumb-black/20': theme === 'light',
                            }
                        )}
                    >
                        {HistoryItem}
                    </FixedSizeList>
                ) : (
                    <div
                        className={clsx('flex flex-col justify-center items-center h-full', {
                            'text-white': theme === 'dark',
                            'text-dark': theme === 'light',
                        })}
                    >
                        {t('DIALER.NO_HISTORY')}
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

const HistoryItem: FunctionComponent<VirtualizedListProps<CallHistory>> = ({ index, style, data }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const theme = useThemeConfig();
    const { number } = useSimCard();
    const { initializeCall } = useCallAPI();

    const call = data[index];

    const contactNumber = call.transmitter === number ? call.receiver : call.transmitter;

    const contact = useContact(contactNumber);

    const handleCall = (phoneNumber: string) => initializeCall(phoneNumber);

    const getIcon = (call: CallHistory) => {
        if (!call.is_accepted) {
            return <PhoneMissedCallIcon className="h-5 w-5 text-red-500 mr-3" />;
        }

        if (call.transmitter === number) {
            return <PhoneOutgoingIcon className="h-5 w-5 text-green-500 mr-3" />;
        } else {
            return <PhoneIncomingIcon className="h-5 w-5 text-green-700 mr-3" />;
        }
    };

    const getText = (call: CallHistory) => {
        if (!call.is_accepted) {
            return (
                <span className="flex gap-4 items-center text-red-500 italic text-sm ">
                    {call.transmitter === number ? 'Appel non abouti' : 'Appel manqué'}
                </span>
            );
        }

        if (call.transmitter === number) {
            return <span className="flex gap-4 items-center text-green-500 italic text-sm">Appel sortant</span>;
        } else {
            return <span className="flex gap-4 items-center text-green-700 italic text-sm">Appel entrant</span>;
        }
    };

    if (!call) {
        return null;
    }

    return (
        <ListButton
            key={call.id}
            style={style}
            actions={[
                {
                    label: 'Ajouter',
                    color: 'bg-gray-500 text-white',
                    icon: UserAddIcon,
                    onClick: () => navigate(`/contacts/-1?addNumber=${contactNumber}&referral=/phone/contacts`),
                    condition: !contact,
                },
                {
                    label: t('GENERIC_EDIT'),
                    color: 'bg-gray-500 text-white',
                    icon: UserAddIcon,
                    onClick: () => navigate(`/contacts/${contact.id}`),
                    condition: Boolean(contact),
                },
                {
                    label: t('GENERIC_MESSAGE'),
                    color: 'bg-blue-500 text-white',
                    icon: ChatIcon,
                    onClick: () => navigate(`/messages/new/${contactNumber}`),
                },
                {
                    label: 'Appeler',
                    color: 'bg-green-500 text-white',
                    icon: PhoneIcon,
                    onClick: () => handleCall(contactNumber),
                },
            ]}
        >
            <div
                className={clsx('flex-1 min-w-0 px-4 py-2 flex items-center space-x-3', {
                    'hover:bg-ios-600': theme === 'dark',
                    'hover:bg-gray-200': theme === 'light',
                })}
            >
                <div className="flex-shrink-0">
                    <ContactPicture picture={contact?.avatar} />
                </div>
                <div className="flex flex-1 min-w-0 cursor-pointer ">
                    <div
                        className={clsx(
                            {
                                'text-gray-100': theme === 'dark',
                                'text-gray-600': theme === 'light',
                            },
                            'shrink self-center text-base flex w-3/5'
                        )}
                    >
                        <div className="flex justify-center items-center w-1/4">{getIcon(call)}</div>
                        <div className="flex flex-col w-3/4 items-start">
                            <p className={clsx('truncate text-left w-full')}>{contact?.display ?? contactNumber}</p>
                            {getText(call)}
                        </div>
                    </div>
                    <div className="text-right w-2/5">
                        <div className="text-gray-500 text-sm">
                            <DayAgo timestamp={call.start} />
                        </div>
                    </div>
                </div>
            </div>
        </ListButton>
    );
};
