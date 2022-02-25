import React, {useCallback, useEffect, useState} from 'react';
import qs from 'qs';
import {useHistory, useLocation} from 'react-router-dom';
import {deleteQueryFromLocation} from '@common/utils/deleteQueryFromLocation';
import {PictureResponsive} from '@ui/components/PictureResponsive';
import {useTranslation} from 'react-i18next';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {MessageEvents} from "@typings/messages";
import {useSnackbar} from "@os/snackbar/hooks/useSnackbar";
import {Dialog, Transition} from "@headlessui/react";
import {Button} from "@ui/components/Button";
import {LocationMarkerIcon, PhotographIcon} from "@heroicons/react/solid";
import {XIcon} from "@heroicons/react/outline";

interface IProps {
    isOpen: boolean;
    messageGroupId: string | undefined;
    onClose(): void;
    image?: string;
}

export const MessageImageModal = ({isOpen, messageGroupId, onClose, image}: IProps) => {
    const history = useHistory();
    const [t] = useTranslation();
    const {pathname, search} = useLocation();
    const {addAlert} = useSnackbar();
    const [queryParamImagePreview, setQueryParamImagePreview] = useState(null);
    const {sendMessage} = useMessageAPI();
    const removeQueryParamImage = useCallback(() => {
        setQueryParamImagePreview(null);
        history.replace(deleteQueryFromLocation({pathname, search}, 'image'));
    }, [history, pathname, search]);

    const sendImageMessage = useCallback(
        (m) => {
            sendMessage({conversationId: messageGroupId, message: m});
            onClose();
        },
        [sendMessage, messageGroupId, onClose],
    );

    const sendFromQueryParam = useCallback(
        (image) => {
            sendImageMessage(image);
            removeQueryParamImage();
        },
        [removeQueryParamImage, sendImageMessage],
    );

    useEffect(() => {
        if (!image) return;
        setQueryParamImagePreview(image);
    }, [image]);

    return (
        <>
            <Transition
                show={isOpen}
                unmount={false}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <ul className="absolute z-30 left-5 bottom-32 w-80 mt-2 origin-bottom-left bg-black bg-opacity-80 divide-y divide-gray-600 divide-opacity-50 rounded-md shadow-lg focus:outline-none">
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_POSITION, {}).then((resp) => {
                                    sendMessage({conversationId: messageGroupId, message: `vec2(${resp.data.x},${resp.data.y})`})
                                })
                            }}
                        >
                            <LocationMarkerIcon className="w-5 h-5 mx-3"/> {t('MESSAGES.POSITION_OPTION')}
                        </Button>
                    </li>
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                fetchNui<ServerPromiseResp<any>>(MessageEvents.GET_DESTINATION, {}).then((resp) => {
                                    if (resp.data.x !== 0 && resp.data.y !== 0) {
                                        sendMessage({conversationId: messageGroupId, message: `vec2(${resp.data.x},${resp.data.y})`})
                                    } else {
                                        addAlert({
                                            message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
                                            type: 'error',
                                        });
                                    }
                                })
                            }}
                        >
                            <LocationMarkerIcon className="w-5 h-5 mx-3"/> {t('MESSAGES.DESTINATION_OPTION')}
                        </Button>
                    </li>
                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={() => {
                                history.push(
                                    `/photo?${qs.stringify({
                                        referal: encodeURIComponent(pathname + search),
                                    })}`,
                                )
                            }}
                        >
                            <PhotographIcon className="w-5 h-5 mx-3"/> {t('MESSAGES.MEDIA_OPTION')}
                        </Button>
                    </li>

                    <li>
                        <Button
                            className="flex items-center w-full text-gray-300 px-2 py-2 hover:text-gray-400"
                            onClick={onClose}
                        >
                            <XIcon className="h-5 w-5 mx-3"/> Fermer
                        </Button>
                    </li>
                </ul>
            </Transition>

            <Transition appear show={queryParamImagePreview !== null}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={removeQueryParamImage}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0"/>
                        </Transition.Child>

                        <span className="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Do you want to share this image?
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        <PictureResponsive src={queryParamImagePreview} alt="Share gallery image preview"/>
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={removeQueryParamImage}
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={() => sendFromQueryParam(queryParamImagePreview)}
                                    >
                                        Partager
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
