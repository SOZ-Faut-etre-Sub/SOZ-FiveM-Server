import 'dayjs/locale/fr';

import { Menu, Transition } from '@headlessui/react';
import {
    PhoneIcon,
    PhoneIncomingIcon,
    PhoneMissedCallIcon,
    PhoneOutgoingIcon,
    UserAddIcon,
} from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { usePhoneNumber } from '../../../hooks/useSimCard';
import { RootState } from '../../../store';

dayjs.extend(relativeTime);

export const DialerHistory: React.FC = () => {
    const calls = useSelector((state: RootState) => state.simCard.callHistory);

    const myNumber = usePhoneNumber();
    const { getDisplayByNumber, getPictureByNumber } = useContact();
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
                        .sort((a, b) => dayjs(b.start).valueOf() - dayjs(a.start).valueOf())
                        .map(call => (
                            <Menu
                                key={call.id}
                                as="li"
                                className={cn('w-full cursor-pointer', {
                                    'bg-black': config.theme.value === 'dark',
                                    'bg-ios-50': config.theme.value === 'light',
                                })}
                            >
                                <Menu.Button className="w-full">
                                    <div
                                        className={cn('relative px-6 py-2 flex items-center space-x-3', {
                                            'hover:bg-gray-900': config.theme.value === 'dark',
                                            'hover:bg-gray-200': config.theme.value === 'light',
                                        })}
                                    >
                                        <div className="flex-shrink-0">
                                            {getPictureByNumber(
                                                call.transmitter === myNumber ? call.receiver : call.transmitter
                                            ) ? (
                                                <img
                                                    className={cn('h-10 w-10 rounded-full', {
                                                        'bg-gray-700': config.theme.value === 'dark',
                                                        'bg-gray-300': config.theme.value === 'light',
                                                    })}
                                                    src={getPictureByNumber(
                                                        call.transmitter === myNumber ? call.receiver : call.transmitter
                                                    )}
                                                    alt=""
                                                />
                                            ) : (
                                                <div
                                                    className={cn('h-10 w-10 rounded-full', {
                                                        'bg-gray-700': config.theme.value === 'dark',
                                                        'bg-gray-300': config.theme.value === 'light',
                                                    })}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 min-w-0 cursor-pointer">
                                            {!call.is_accepted ? (
                                                <PhoneMissedCallIcon className="h-5 w-5 text-red-500 mr-3" />
                                            ) : call.transmitter === myNumber ? (
                                                <PhoneOutgoingIcon className="h-5 w-5 text-green-500 mr-3" />
                                            ) : (
                                                <PhoneIncomingIcon className="h-5 w-5 text-green-700 mr-3" />
                                            )}
                                            <p
                                                className={cn('text-left text-sm font-medium', {
                                                    'text-gray-100': config.theme.value === 'dark',
                                                    'text-gray-600': config.theme.value === 'light',
                                                })}
                                            >
                                                {getDisplayByNumber(
                                                    call.transmitter === myNumber ? call.receiver : call.transmitter
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {dayjs(call.start).locale('fr').from(dayjs(new Date().getTime()), true)}
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
                                    <Menu.Items className="w-64 mt-2 origin-top-right bg-black bg-opacity-70 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                                        <Menu.Item>
                                            <Button
                                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                onClick={() =>
                                                    handleCall(
                                                        call.transmitter === myNumber ? call.receiver : call.transmitter
                                                    )
                                                }
                                            >
                                                <PhoneIcon className="mx-3 h-5 w-5" /> Appeler
                                            </Button>
                                        </Menu.Item>
                                        {getDisplayByNumber(call.receiver) === call.receiver &&
                                            myNumber !== call.receiver && (
                                                <Menu.Item>
                                                    <Button
                                                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                                        onClick={() =>
                                                            navigate(
                                                                `/contacts/-1?addNumber=${call.receiver}&referral=/phone/contacts`
                                                            )
                                                        }
                                                    >
                                                        <UserAddIcon className="mx-3 h-5 w-5" /> Ajouter le contact
                                                    </Button>
                                                </Menu.Item>
                                            )}
                                        {getDisplayByNumber(call.transmitter) === call.transmitter &&
                                            myNumber !== call.transmitter && (
                                                <Menu.Item>
                                                    <Button
                                                        className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-500"
                                                        onClick={() =>
                                                            navigate(
                                                                `/contacts/-1?addNumber=${call.transmitter}&referral=/phone/contacts`
                                                            )
                                                        }
                                                    >
                                                        <UserAddIcon className="mx-3 h-5 w-5" /> Ajouter le contact
                                                    </Button>
                                                </Menu.Item>
                                            )}
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ))}
                </ul>
            </div>
        </nav>
    );
};
