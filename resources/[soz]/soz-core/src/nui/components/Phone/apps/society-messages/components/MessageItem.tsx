import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { BookmarkIcon, ChatIcon, DuplicateIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { CSSProperties, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, MeasuredCellParent } from 'react-virtualized';

import { SocietyMessage } from '../../../../../../shared/phone/apps/society';
import { Message, Separator } from '../../../../../../shared/phone/simcard';
import { DayAgo } from '../../../components/DayAgo';
import { ListButton } from '../../../components/List';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useSocietyMessages } from '../messages.atom';

export const MessageItem: FunctionComponent<{ message: SocietyMessage }> = ({ message }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeConfig();

    return (
        <div className="my-4">
            <ListButton
                style={{ height: 200 }}
                actionWidth={64}
                className={clsx('border-l-8 rounded-l-none', {
                    'border-red-500/70': message.info?.type === 'red-alert',
                    'border-lime-500/70': message.info?.type === 'robbery',
                    'border-yellow-400/70': message.info?.type === 'vandalism',
                    'border-orange-500/70': message.info?.type === 'racket',
                    'border-indigo-500/70': message.info?.type === 'shooting',
                    'border-cyan-500/70': message.info?.type === 'auto-theft',
                    'border-teal-300/70': message.info?.type === 'drug',
                    'border-pink-500/70': message.info?.type === 'explosion',
                    'border-green-500/70': message.info?.type === 'default' || !message.info?.type,
                })}
                actions={[
                    {
                        label: 'Clôturer',
                        color: 'bg-orange-500 text-white',
                        icon: BookmarkIcon,
                        onClick: () => {}, // setMessageState(message.id, true, true)
                        condition: message.isTaken && !message.isDone,
                    },
                    {
                        label: 'Prendre',
                        color: 'bg-orange-500 text-white',
                        icon: BookmarkIcon,
                        onClick: () => () => {}, // setMessageState(message.id, true, false)
                        condition: !message.isTaken,
                    },
                    {
                        label: 'Aller à la position',
                        color: 'bg-gray-500 text-white',
                        icon: LocationMarkerIcon,
                        onClick: () => () => {}, // setWaypoint(message.position)
                        condition: Boolean(message.position),
                    },
                    {
                        label: 'Copier le texte',
                        color: 'bg-gray-500 text-white',
                        icon: DuplicateIcon,
                        onClick: () => () => {}, // setClipboard(message.message)
                        condition: Boolean(message.message),
                    },
                    {
                        label: t('GENERIC_MESSAGE'),
                        color: 'bg-blue-500 text-white',
                        icon: ChatIcon,
                        onClick: () => navigate(`/messages/new/${message.source_phone}`),
                        condition: message.source_phone !== '',
                    },
                    {
                        label: 'Appeler',
                        color: 'bg-green-500 text-white',
                        icon: PhoneIcon,
                        onClick: () => () => {}, // startCall(message.source_phone)
                        condition: message.source_phone !== '',
                    },
                ]}
            >
                <div className="flex flex-col gap-4 p-4 min-w-0">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            {!message.source_phone && (
                                <span
                                    className={clsx('rounded-full px-3 py-0', {
                                        'bg-gray-200': theme === 'light',
                                        'bg-gray-600': theme === 'dark',
                                    })}
                                >
                                    Anonyme
                                </span>
                            )}
                            {message?.info?.notificationId && (
                                <span
                                    className={clsx('rounded-full px-3 py-0 ml-1', {
                                        'bg-gray-200': theme === 'light',
                                        'bg-gray-600': theme === 'dark',
                                    })}
                                >
                                    #{message.info.notificationId}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col items-end text-left text-xs text-gray-400">
                            {message.isDone ? (
                                <span>L'appel est fini !</span>
                            ) : message.isTaken ? (
                                <span>L'appel est pris par {message.takenByUsername} !</span>
                            ) : null}
                            <span>
                                <DayAgo timestamp={message.createdAt} />
                            </span>
                        </div>
                    </div>

                    <p
                        className={clsx('text-left mt-[4px] text-sm font-medium break-words whitespace-pre-wrap ', {
                            'text-gray-100': theme === 'dark',
                            'text-gray-700': theme === 'light',
                        })}
                    >
                        {message.message}
                    </p>
                </div>
            </ListButton>
        </div>
    );
    {
        /*<Menu as="li" style={style}>*/
    }
    {
        /*    <Menu.Button className="w-full">*/
    }
    {
        /*        <div className={cn('w-full p-1')}>*/
    }
    {
        /*            <div*/
    }
    {
        /*                className={cn('relative px-6 py-2 flex items-center space-x-3 rounded-md', {*/
    }
    {
        /*                    'hover:bg-ios-600 bg-ios-700': config.theme.value === 'dark',*/
    }
    {
        /*                    'hover:bg-gray-300 bg-white': config.theme.value === 'light',*/
    }
    {
        /*                    [alertFDOBorder]: isFDOPlayer,*/
    }
    {
        /*                })}*/
    }
    {
        /*                style={{ transition: 'all 0.15s' }}*/
    }
    {
        /*            >*/
    }
    {
        /*                <div className="flex-1 min-w-0 cursor-pointer">*/
    }
    {
        /*                    <span className="absolute inset-0" aria-hidden="true" />*/
    }
    {
        /*                    <p*/
    }
    {
        /*                        className={cn('text-left text-xs font-bold', {*/
    }
    {
        /*                            'text-white': config.theme.value === 'dark',*/
    }
    {
        /*                            'text-gray-500': config.theme.value === 'light',*/
    }
    {
        /*                        })}*/
    }
    {
        /*                    >*/
    }
    {
        /*                        {!message.source_phone ? (*/
    }
    {
        /*                            <span*/
    }
    {
        /*                                className={cn('rounded-full px-3 py-0', {*/
    }
    {
        /*                                    'bg-gray-200': config.theme.value === 'light',*/
    }
    {
        /*                                    'bg-gray-600': config.theme.value === 'dark',*/
    }
    {
        /*                                })}*/
    }
    {
        /*                            >*/
    }
    {
        /*                                Anonyme*/
    }
    {
        /*                            </span>*/
    }
    {
        /*                        ) : (*/
    }
    {
        /*                            <span></span>*/
    }
    {
        /*                        )}*/
    }
    {
        /*                        {message?.info?.notificationId ? (*/
    }
    {
        /*                            <span*/
    }
    {
        /*                                className={cn('rounded-full px-3 py-0 ml-1', {*/
    }
    {
        /*                                    'bg-gray-200': config.theme.value === 'light',*/
    }
    {
        /*                                    'bg-gray-600': config.theme.value === 'dark',*/
    }
    {
        /*                                })}*/
    }
    {
        /*                            >*/
    }
    {
        /*                                #{message.info.notificationId}*/
    }
    {
        /*                            </span>*/
    }
    {
        /*                        ) : (*/
    }
    {
        /*                            <span></span>*/
    }
    {
        /*                        )}*/
    }
    {
        /*                    </p>*/
    }
    {
        /*                    <p*/
    }
    {
        /*                        className={cn(*/
    }
    {
        /*                            'text-left mt-[4px] text-sm font-medium break-words whitespace-pre-wrap',*/
    }
    {
        /*                            {*/
    }
    {
        /*                                'text-gray-100': config.theme.value === 'dark',*/
    }
    {
        /*                                'text-gray-700': config.theme.value === 'light',*/
    }
    {
        /*                            }*/
    }
    {
        /*                        )}*/
    }
    {
        /*                    >*/
    }
    {
        /*                        {message.message}*/
    }
    {
        /*                    </p>*/
    }
    {
        /*                    <p className="flex justify-between text-left text-xs text-gray-400">*/
    }
    {
        /*                        {message.isDone ? (*/
    }
    {
        /*                            <span>L'appel est fini !</span>*/
    }
    {
        /*                        ) : message.isTaken ? (*/
    }
    {
        /*                            <span>L'appel est pris par {message.takenByUsername} !</span>*/
    }
    {
        /*                        ) : (*/
    }
    {
        /*                            <span></span>*/
    }
    {
        /*                        )}*/
    }
    {
        /*                        <span>*/
    }
    {
        /*                            <DayAgo timestamp={message.createdAt} />*/
    }
    {
        /*                        </span>*/
    }
    {
        /*                    </p>*/
    }
    {
        /*                </div>*/
    }
    {
        /*            </div>*/
    }
    {
        /*        </div>*/
    }
    {
        /*    </Menu.Button>*/
    }
    {
        /*    <Transition*/
    }
    {
        /*        enter="transition duration-100 ease-out"*/
    }
    {
        /*        enterFrom="transform scale-95 opacity-0"*/
    }
    {
        /*        enterTo="transform scale-100 opacity-100"*/
    }
    {
        /*        leave="transition duration-75 ease-out"*/
    }
    {
        /*        leaveFrom="transform scale-100 opacity-100"*/
    }
    {
        /*        leaveTo="transform scale-95 opacity-0"*/
    }
    {
        /*        className="absolute z-30 right-0"*/
    }
    {
        /*    >*/
    }
    {
        /*        <Menu.Items className="w-56 mt-2 origin-top-right bg-ios-600 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">*/
    }
    {
        /*            {message.isTaken ? (*/
    }
    {
        /*                !message.isDone && (*/
    }
    {
        /*                    <Button*/
    }
    {
        /*                        className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                        onClick={() => setMessageState(message.id, true, true)}*/
    }
    {
        /*                    >*/
    }
    {
        /*                        <BookmarkIcon className="mx-3 h-5 w-5" /> Clôturer l'appel*/
    }
    {
        /*                    </Button>*/
    }
    {
        /*                )*/
    }
    {
        /*            ) : (*/
    }
    {
        /*                <Button*/
    }
    {
        /*                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                    onClick={() => setMessageState(message.id, true, false)}*/
    }
    {
        /*                >*/
    }
    {
        /*                    <BookmarkIcon className="mx-3 h-5 w-5" /> Prendre l'appel*/
    }
    {
        /*                </Button>*/
    }
    {
        /*            )}*/
    }

    {
        /*            {message.position && (*/
    }
    {
        /*                <Button*/
    }
    {
        /*                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                    onClick={() => setWaypoint(message.position)}*/
    }
    {
        /*                >*/
    }
    {
        /*                    <LocationMarkerIcon className="mx-3 h-5 w-5" /> Aller à la position*/
    }
    {
        /*                </Button>*/
    }
    {
        /*            )}*/
    }
    {
        /*            {message.message && (*/
    }
    {
        /*                <Button*/
    }
    {
        /*                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                    onClick={() => setClipboard(message.message)}*/
    }
    {
        /*                >*/
    }
    {
        /*                    <DuplicateIcon className="mx-3 h-5 w-5" /> Copier le texte{' '}*/
    }
    {
        /*                </Button>*/
    }
    {
        /*            )}*/
    }

    {
        /*            {message.source_phone !== '' && (*/
    }
    {
        /*                <Button*/
    }
    {
        /*                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                    onClick={() => startMessage(message.source_phone)}*/
    }
    {
        /*                >*/
    }
    {
        /*                    <ChatIcon className="mx-3 h-5 w-5" /> Message*/
    }
    {
        /*                </Button>*/
    }
    {
        /*            )}*/
    }

    {
        /*            {message.source_phone !== '' && (*/
    }
    {
        /*                <Button*/
    }
    {
        /*                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"*/
    }
    {
        /*                    onClick={() => startCall(message.source_phone)}*/
    }
    {
        /*                >*/
    }
    {
        /*                    <PhoneIcon className="mx-3 h-5 w-5" /> Appeler*/
    }
    {
        /*                </Button>*/
    }
    {
        /*            )}*/
    }
    {
        /*        </Menu.Items>*/
    }
    {
        /*    </Transition>*/
    }
    {
        /*</Menu>*/
    }
    // );
};
