import { BookmarkIcon, ChatIcon, DuplicateIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { SocietyMessage } from '../../../../../../shared/phone/apps/society';
import { fetchNui } from '../../../../../fetch';
import { useClipboard } from '../../../../../hook/clipboard';
import { useCallAPI } from '../../../api/useCallAPI';
import { DayAgo } from '../../../components/DayAgo';
import { ListButton } from '../../../components/List';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useSocietySimCard } from '../../../system/sim-card/hooks/useSocietySimCard';

export const MessageItem: FunctionComponent<{ message: SocietyMessage }> = ({ message }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useThemeConfig();
    const copyToClipboard = useClipboard();

    const { initializeCall } = useCallAPI();
    const { canUseDynamicAlerts } = useSocietySimCard();

    return (
        <div className="my-1">
            <ListButton
                key={message.id}
                actionWidth={64}
                className={clsx('relative h-full rounded-lg', {
                    'border-l-8': canUseDynamicAlerts,
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
                        onClick: () =>
                            fetchNui(NuiEvent.PhoneAppSocietyUpdateMessage, { id: message.id, isDone: true }),
                        condition: message.isTaken && !message.isDone,
                    },
                    {
                        label: 'Prendre',
                        color: 'bg-orange-500 text-white',
                        icon: BookmarkIcon,
                        onClick: () =>
                            fetchNui(NuiEvent.PhoneAppSocietyUpdateMessage, { id: message.id, isTaken: true }),
                        condition: !message.isTaken,
                    },
                    {
                        label: 'Aller à la position',
                        color: 'bg-gray-500 text-white',
                        icon: LocationMarkerIcon,
                        onClick: () => fetchNui(NuiEvent.SetWaypoint, JSON.parse(message.position)),
                        condition: Boolean(message.position),
                    },
                    {
                        label: 'Copier le texte',
                        color: 'bg-gray-500 text-white',
                        icon: DuplicateIcon,
                        onClick: () => copyToClipboard(message.message),
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
                        onClick: () => initializeCall(message.source_phone),
                        condition: message.source_phone !== '',
                    },
                ]}
            >
                <div className="flex flex-col grow gap-4 p-4 min-w-0">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            {message?.info?.notificationId && (
                                <span
                                    className={clsx('rounded-full px-3', {
                                        'bg-orange-200': theme === 'light',
                                        'bg-orange-600': theme === 'dark',
                                    })}
                                >
                                    #{message.info.notificationId}
                                </span>
                            )}

                            <span
                                className={clsx('rounded-full px-3 ', {
                                    'bg-gray-200': theme === 'light',
                                    'bg-gray-600': theme === 'dark',
                                })}
                            >
                                {message.source_phone ? <>{message.source_phone}</> : <>Anonyme</>}
                            </span>
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
};
