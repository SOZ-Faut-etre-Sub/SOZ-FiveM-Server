import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon, PhotographIcon } from '@heroicons/react/solid';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import { Button } from '@ui/old_components/Button';
import { fetchNui } from '@utils/fetchNui';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMessageAPI } from '../../hooks/useMessageAPI';

interface IProps {
    isOpen: boolean;
    messageGroupId: string | undefined;
    onClose(): void;
    image?: string;
}

export const MessageImageModal = ({ isOpen, messageGroupId, onClose, image }: IProps) => {
    const navigate = useNavigate();
    const [t] = useTranslation();
    const { pathname, search } = useLocation();
    const { addAlert } = useSnackbar();
    const { sendMessage } = useMessageAPI();

    const sendImageMessage = useCallback(
        m => {
            sendMessage({ conversationId: messageGroupId, message: m });
            onClose();
        },
        [sendMessage, messageGroupId, onClose]
    );

    useEffect(() => {
        if (!image) return;
        sendImageMessage(image);
        navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
    }, [image]);

    return (
        <>
            <Transition
                show={isOpen}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <ul className="absolute z-30 left-5 bottom-0 w-80 mt-2 origin-bottom-left bg-ios-800 bg-opacity-80 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_POSITION, {}).then(resp => {
                                    sendMessage({
                                        conversationId: messageGroupId,
                                        message: `vec2(${resp.data.x},${resp.data.y})`,
                                    });
                                    onClose();
                                });
                            }}
                        >
                            <LocationMarkerIcon className="w-5 h-5 mx-3" /> {t('MESSAGES.POSITION_OPTION')}
                        </Button>
                    </li>
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_DESTINATION, {}).then(resp => {
                                    if (resp.data.x !== 0 && resp.data.y !== 0) {
                                        sendMessage({
                                            conversationId: messageGroupId,
                                            message: `vec2(${resp.data.x},${resp.data.y})`,
                                        });
                                        onClose();
                                    } else {
                                        addAlert({
                                            message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
                                            type: 'error',
                                        });
                                    }
                                });
                            }}
                        >
                            <LocationMarkerIcon className="w-5 h-5 mx-3" /> {t('MESSAGES.DESTINATION_OPTION')}
                        </Button>
                    </li>
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                navigate(
                                    `/photo?${qs.stringify({
                                        referral: encodeURIComponent(pathname + search),
                                    })}`
                                );
                            }}
                        >
                            <PhotographIcon className="w-5 h-5 mx-3" /> {t('MESSAGES.MEDIA_OPTION')}
                        </Button>
                    </li>

                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={onClose}
                        >
                            <XIcon className="h-5 w-5 mx-3" /> Fermer
                        </Button>
                    </li>
                </ul>
            </Transition>
        </>
    );
};
