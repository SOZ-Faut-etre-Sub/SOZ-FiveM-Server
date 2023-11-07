import { Menu, Transition } from '@headlessui/react';
import {
    ChatIcon,
    PhoneIcon,
    PhoneIncomingIcon,
    PhoneMissedCallIcon,
    PhoneOutgoingIcon,
    UserAddIcon,
} from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { usePhoneNumber } from '../../../hooks/useSimCard';
import { RootState } from '../../../store';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { DayAgo } from '../../../ui/components/DayAgo';

export const DialerHistory: React.FC = () => {
    const calls = useSelector((state: RootState) => state.simCard.callHistory);

    const myNumber = usePhoneNumber();
    const { getDisplayByNumber, getPictureByNumber, getIdByNumber } = useContact();
    const config = useConfig();
    const { initializeCall } = useCall();
    const navigate = useNavigate();
    const [t] = useTranslation();

    const handleCall = phoneNumber => {
        initializeCall(phoneNumber);
    };

    if (calls.length === 0) {
        return (
            <div
                className={cn('flex h-full justify-center items-center text-white', {
                    'text-gray-100': config.theme.value === 'dark',
                    'text-gray-600': config.theme.value === 'light',
                })}
            >
                <p>{t('DIALER.NO_HISTORY')}</p>
            </div>
        );
    }

    return (
        <nav className="pb-10 h-full overflow-y-auto" aria-label="Directory">
            <div className="relative">
                <ul
                    className={cn('relative divide-y', {
                        'divide-gray-700': config.theme.value === 'dark',
                        'divide-gray-200': config.theme.value === 'light',
                    })}
                >
                    {calls
                        .sort((a, b) => b.start - a.start)
                        .map(call => {
                            const contactNumber = call.transmitter === myNumber ? call.receiver : call.transmitter;
                            const isContactRegistered = getDisplayByNumber(contactNumber) !== contactNumber;
                            return (
                                <Menu
                                    key={call.id}
                                    as="li"
                                    className={cn('w-full cursor-pointer', {
                                        'bg-ios-800': config.theme.value === 'dark',
                                        'bg-ios-50': config.theme.value === 'light',
                                    })}
                                >
                                    <Menu.Button className="w-full">
                                        <div
                                            className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                                'hover:bg-ios-600': config.theme.value === 'dark',
                                                'hover:bg-gray-200': config.theme.value === 'light',
                                            })}
                                        >
                                            <div className="flex-shrink-0">
                                                <ContactPicture picture={getPictureByNumber(contactNumber)} />
                                            </div>
                                            <div className="flex flex-1 min-w-0 cursor-pointer">
                                                <div className="shrink self-center">
                                                    {!call.is_accepted ? (
                                                        <PhoneMissedCallIcon className="h-5 w-5 text-red-500 mr-3" />
                                                    ) : call.transmitter === myNumber ? (
                                                        <PhoneOutgoingIcon className="h-5 w-5 text-green-500 mr-3" />
                                                    ) : (
                                                        <PhoneIncomingIcon className="h-5 w-5 text-green-700 mr-3" />
                                                    )}
                                                </div>
                                                <div
                                                    className={cn(
                                                        'grid grid-rows-2 text-left text-sm font-medium truncate',
                                                        {
                                                            'text-gray-100': config.theme.value === 'dark',
                                                            'text-gray-600': config.theme.value === 'light',
                                                        }
                                                    )}
                                                >
                                                    <p
                                                        className={cn({
                                                            'row-span-2':
                                                                getDisplayByNumber(contactNumber) === contactNumber,
                                                            'row-span-1':
                                                                getDisplayByNumber(contactNumber) !== contactNumber,
                                                        })}
                                                    >
                                                        {getDisplayByNumber(contactNumber)}
                                                    </p>
                                                    {getDisplayByNumber(contactNumber) != contactNumber && (
                                                        <p className="text-left text-sm font-medium truncate row-span-1">
                                                            {contactNumber}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                <DayAgo timestamp={call.start} />
                                            </div>
                                        </div>
                                    </Menu.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                        className="absolute z-30 right-0"
                                    >
                                        <Menu.Items className="w-64 mt-2 origin-top-right bg-ios-800 bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                            <Menu.Item>
                                                <Button
                                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                    onClick={() => handleCall(contactNumber)}
                                                >
                                                    <PhoneIcon className="mx-3 h-5 w-5" /> Appeler
                                                </Button>
                                            </Menu.Item>
                                            {!isContactRegistered && (
                                                <Menu.Item>
                                                    <Button
                                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                        onClick={() =>
                                                            navigate(
                                                                `/contacts/-1?addNumber=${contactNumber}&referral=/phone/contacts`
                                                            )
                                                        }
                                                    >
                                                        <UserAddIcon className="mx-3 h-5 w-5" /> Ajouter le contact
                                                    </Button>
                                                </Menu.Item>
                                            )}
                                            {isContactRegistered && (
                                                <Menu.Item>
                                                    <Button
                                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                        onClick={() =>
                                                            navigate(`/contacts/${getIdByNumber(contactNumber)}`)
                                                        }
                                                    >
                                                        <UserAddIcon className="mx-3 h-5 w-5" /> {t('GENERIC_EDIT')}
                                                    </Button>
                                                </Menu.Item>
                                            )}
                                            <Menu.Item>
                                                <Button
                                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                    onClick={() => navigate(`/messages/new/${contactNumber}`)}
                                                >
                                                    <ChatIcon className="mx-3 h-5 w-5" /> {t('GENERIC_MESSAGE')}
                                                </Button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            );
                        })}
                </ul>
            </div>
        </nav>
    );
};
