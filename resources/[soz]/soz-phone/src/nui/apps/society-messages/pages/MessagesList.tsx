import { Menu, Transition } from '@headlessui/react';
import { DuplicateIcon } from '@heroicons/react/outline';
import { BookmarkIcon, ChatIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import { SocietyEvents, SocietyMessage } from '@typings/society';
import { Button } from '@ui/old_components/Button';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { CSSProperties, FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';

import { useSociety } from '../../../hooks/app/useSociety';
import { useConfig } from '../../../hooks/usePhone';
import { usePhoneSocietyNumber } from '../../../hooks/useSimCard';
import { DayAgo } from '../../../ui/components/DayAgo';
import { IPhoneSettings } from '../../settings/hooks/useSettings';
import { useMessageNotifications } from '../hooks/useMessageNotifications';
import { borderColor } from '../utils/alertType';
import { alerts } from '../utils/constants';

const MessagesList = (): any => {
    const [selected, setSelected] = React.useState<number>(1);
    const config = useConfig();
    const { initializeCall } = useCall();
    const navigate = useNavigate();

    const { getSocietyMessages } = useSociety();
    const societyNumber = usePhoneSocietyNumber();
    const societyMessages = getSocietyMessages();
    const { removeNotification } = useMessageNotifications();

    const isFDOPlayer = (): boolean => {
        return ['555-LSPD', '555-BCSO', '555-SASP', '555-FBI', '555-LSCS'].some(
            allowedNumber => allowedNumber === societyNumber
        );
    };

    const startCall = (number: string) => {
        LogDebugEvent({
            action: 'Emitting `Start Call` to Scripts',
            level: 2,
            data: true,
        });
        initializeCall(number);
    };

    const startMessage = (phoneNumber: string) => {
        navigate(`/messages/new/${phoneNumber}`);
    };

    const setWaypoint = pos => {
        const position = JSON.parse(pos);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position.x,
            y: position.y,
        });
    };

    const setMessageState = (id, take, done) => {
        fetchNui<ServerPromiseResp<void>>(SocietyEvents.UPDATE_SOCIETY_MESSAGE, {
            id,
            take,
            done,
        });
    };

    useEffect(() => {
        removeNotification();
    }, []);

    const messagesToRender = isFDOPlayer()
        ? societyMessages.filter(message => {
              return selected === 1
                  ? alerts.includes(message.info?.type)
                  : selected === 2
                  ? !alerts.includes(message.info?.type)
                  : true;
          })
        : societyMessages;

    messagesToRender.sort((a, b) => {
        return b.createdAt - a.createdAt;
    });

    const cache = new CellMeasurerCache({
        defaultHeight: 200,
        fixedWidth: true,
    });

    return (
        <div className="h-full pb-[1.5rem]">
            {isFDOPlayer() && (
                <div className="flex justify-around gap-2 rounded-md">
                    <button
                        className={cn(
                            {
                                'border-blue-500': selected === 1,
                                'border-ios-700 hover:border-ios-600': selected != 1 && config.theme.value === 'dark',
                                'border-ios-500 hover:border-ios-600': selected != 1 && config.theme.value === 'light',
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
                            },

                            ' w-1/2 border-b-[3px] p-2'
                        )}
                        style={{ transition: 'all 0.15s' }}
                        onClick={() => {
                            setSelected(1);
                        }}
                    >
                        Alertes
                    </button>
                    <button
                        className={cn(
                            {
                                'border-blue-500': selected === 2,
                                'border-ios-700 hover:border-ios-600': selected != 2 && config.theme.value === 'dark',
                                'border-ios-500 hover:border-ios-600': selected != 2 && config.theme.value === 'light',
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
                            },
                            'w-1/2 border-b-[3px] p-2 '
                        )}
                        style={{ transition: 'all 0.15s' }}
                        onClick={() => {
                            setSelected(2);
                        }}
                    >
                        Public
                    </button>
                </div>
            )}
            <ul className={`mt-5 relative divide-y space-y-1 h-full w-full`}>
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowCount={messagesToRender.length}
                            rowRenderer={({ index, parent, style }) => {
                                const message = messagesToRender[index];
                                if (!message) {
                                    return null;
                                }

                                return (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        config={config}
                                        startCall={startCall}
                                        startMessage={startMessage}
                                        setWaypoint={setWaypoint}
                                        setMessageState={setMessageState}
                                        cache={cache}
                                        parent={parent}
                                        index={index}
                                        style={style}
                                        isFDOPlayer={isFDOPlayer()}
                                    />
                                );
                            }}
                            scrollToIndex={0}
                            width={width}
                            height={height}
                            deferredMeasurementCache={cache}
                            rowHeight={cache.rowHeight}
                            containerStyle={{ overflow: 'initial' }}
                        />
                    )}
                </AutoSizer>
            </ul>
        </div>
    );
};

type MessageItemProps = {
    message: SocietyMessage;
    config: IPhoneSettings;
    startCall: (number: string) => void;
    startMessage: (phoneNumber: string) => void;
    setWaypoint: (pos: string) => void;
    setMessageState: (id: number, take: boolean, done: boolean) => void;
    cache: CellMeasurerCache;
    parent: MeasuredCellParent;
    index: number;
    style: CSSProperties;
    isFDOPlayer?: boolean;
};

export const MessageItem: FunctionComponent<MessageItemProps> = ({
    message,
    config,
    startMessage,
    startCall,
    setWaypoint,
    setMessageState,
    cache,
    parent,
    index,
    style,
    isFDOPlayer,
}) => {
    const alertFDOBorder = `border-l-8 rounded-l-none ${borderColor(message.info?.type)}`;
    return (
        <CellMeasurer key={message.id} cache={cache} parent={parent} columnCount={1} columnIndex={0} rowIndex={index}>
            <Menu as="li" style={style}>
                <Menu.Button className="w-full">
                    <div className={cn('w-full p-1')}>
                        <div
                            className={cn('relative px-6 py-2 flex items-center space-x-3 rounded-md', {
                                'hover:bg-ios-600 bg-ios-700': config.theme.value === 'dark',
                                'hover:bg-gray-300 bg-white': config.theme.value === 'light',
                                [alertFDOBorder]: isFDOPlayer,
                            })}
                            style={{ transition: 'all 0.15s' }}
                        >
                            <div className="flex-1 min-w-0 cursor-pointer">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p
                                    className={cn('text-left text-xs font-bold', {
                                        'text-white': config.theme.value === 'dark',
                                        'text-gray-500': config.theme.value === 'light',
                                    })}
                                >
                                    {!message.source_phone ? (
                                        <span
                                            className={cn('rounded-full px-3 py-0', {
                                                'bg-gray-200': config.theme.value === 'light',
                                                'bg-gray-600': config.theme.value === 'dark',
                                            })}
                                        >
                                            Anonyme
                                        </span>
                                    ) : (
                                        <span></span>
                                    )}
                                    {message?.info?.notificationId ? (
                                        <span
                                            className={cn('rounded-full px-3 py-0 ml-1', {
                                                'bg-gray-200': config.theme.value === 'light',
                                                'bg-gray-600': config.theme.value === 'dark',
                                            })}
                                        >
                                            #{message.info.notificationId}
                                        </span>
                                    ) : (
                                        <span></span>
                                    )}
                                </p>
                                <p
                                    className={cn(
                                        'text-left mt-[4px] text-sm font-medium break-words whitespace-pre-wrap',
                                        {
                                            'text-gray-100': config.theme.value === 'dark',
                                            'text-gray-700': config.theme.value === 'light',
                                        }
                                    )}
                                >
                                    {message.message}
                                </p>
                                <p className="flex justify-between text-left text-xs text-gray-400">
                                    {message.isDone ? (
                                        <span>L'appel est fini !</span>
                                    ) : message.isTaken ? (
                                        <span>L'appel est pris par {message.takenByUsername} !</span>
                                    ) : (
                                        <span></span>
                                    )}
                                    <span>
                                        <DayAgo timestamp={message.createdAt} />
                                    </span>
                                </p>
                            </div>
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
                    <Menu.Items className="w-56 mt-2 origin-top-right bg-ios-600 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                        {message.isTaken ? (
                            !message.isDone && (
                                <Button
                                    className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                    onClick={() => setMessageState(message.id, true, true)}
                                >
                                    <BookmarkIcon className="mx-3 h-5 w-5" /> Clôturer l'appel
                                </Button>
                            )
                        ) : (
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => setMessageState(message.id, true, false)}
                            >
                                <BookmarkIcon className="mx-3 h-5 w-5" /> Prendre l'appel
                            </Button>
                        )}

                        {message.position && (
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => setWaypoint(message.position)}
                            >
                                <LocationMarkerIcon className="mx-3 h-5 w-5" /> Aller à la position
                            </Button>
                        )}
                        {message.message && (
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => setClipboard(message.message)}
                            >
                                <DuplicateIcon className="mx-3 h-5 w-5" /> Copier le texte{' '}
                            </Button>
                        )}

                        {message.source_phone !== '' && (
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => startMessage(message.source_phone)}
                            >
                                <ChatIcon className="mx-3 h-5 w-5" /> Message
                            </Button>
                        )}

                        {message.source_phone !== '' && (
                            <Button
                                className="flex items-center w-full text-white px-2 py-2 hover:text-gray-300"
                                onClick={() => startCall(message.source_phone)}
                            >
                                <PhoneIcon className="mx-3 h-5 w-5" /> Appeler
                            </Button>
                        )}
                    </Menu.Items>
                </Transition>
            </Menu>
        </CellMeasurer>
    );
};

export default MessagesList;
