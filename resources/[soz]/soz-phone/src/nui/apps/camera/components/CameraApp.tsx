import { Transition } from '@headlessui/react';
import { ChevronUpIcon, RefreshIcon } from '@heroicons/react/outline';
import { ColorSwatchIcon, CubeIcon, EmojiHappyIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ApiEvents } from '../../../../../typings/api';
import { useApiConfig } from '../../../hooks/useApi';
import { useVisibility } from '../../../hooks/usePhone';
import { usePhoto } from '../../../hooks/usePhoto';
import { useCall } from '../../../hooks/useSimCard';
import { useBackground } from '../../../ui/hooks/useBackground';
import { createGameView, GameView } from '../hooks/createGameView';

const CameraApp: React.FC = () => {
    const backgroundClass = useBackground();
    const navigate = useNavigate();
    const [t] = useTranslation();
    const apiConfig = useApiConfig();

    const call = useCall();

    const { getPhotos } = usePhoto();
    const photos = getPhotos();

    const { addAlert } = useSnackbar();
    const { visibility } = useVisibility();
    const [gameView, setGameView] = React.useState<GameView>(null);

    useEffect(() => {
        if (gameView !== null) {
            gameView.startRender();
        }

        return () => {
            if (gameView !== null) {
                gameView.stopRender();
            }
        };
    }, [gameView]);

    const handleTakePhoto = async () => {
        if (!gameView) {
            return addAlert({
                message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
                type: 'error',
            });
        }

        const blob = await gameView.takeScreenshot();
        const formData = new FormData();
        const file = new File([blob], 'screenshot.jpg', { type: 'image/jpeg' });

        const operations = `{"operationName": "createScreenshot", "variables": {"file":null}, "query":"mutation createScreenshot($file: Upload!) { createScreenshot(file: $file) {url} }"}`;
        formData.append('operations', operations);

        const map = `{"0": ["variables.file"]}`;
        formData.append('map', map);
        formData.append('0', file);

        const token = await fetchNui<string>(ApiEvents.FETCH_TOKEN, {});
        const response = await fetch(apiConfig.apiEndpoint, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const responseJson = await response.json();
        const url = responseJson?.data?.createScreenshot?.url;

        if (url) {
            const serverResp = await fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.TAKE_PHOTO, {
                url: `${apiConfig.publicEndpoint}${url}`,
            });

            if (serverResp.status !== 'ok') {
                return addAlert({
                    message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
                    type: 'error',
                });
            }

            return addAlert({
                message: t('CAMERA.TAKE_PHOTO_SUCCESS'),
                type: 'success',
            });
        }

        return addAlert({
            message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
            type: 'error',
        });
    };

    const toggleCameraPhotoMode = async () => {
        await fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CAMERA, {});
    };

    useEffect(() => {
        if (!visibility) navigate('/', { replace: true });
        fetchNui<ServerPromiseResp<void>>(PhotoEvents.ENTER_CAMERA, {});

        return () => {
            fetchNui<ServerPromiseResp<void>>(PhotoEvents.EXIT_CAMERA, {});
        };
    }, [visibility]);

    useEffect(() => {
        if (call) {
            addAlert({
                message: t('CAMERA.IS_NOT_AVAILABLE_DURING_CALL'),
                type: 'error',
            });
            navigate('/', { replace: true });
        }
    }, [call]);

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[80%_80%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[80%_80%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <AppContent className="self-center" scrollable={false}>
                        <div className="absolute top-0 inset-x-0 flex justify-between px-6 pt-3">
                            <div className="flex place-self-start">
                                <EmojiHappyIcon className="h-7 w-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                                <LightningBoltIcon className="h-7 w-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                            </div>
                            <ChevronUpIcon className="h-7 w-7 p-1 bg-white bg-opacity-25 text-white rounded-full" />
                            <div className="flex place-self-end">
                                <CubeIcon className="h-7 w-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                                <ColorSwatchIcon className="h-7 w-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                            </div>
                        </div>

                        <canvas
                            ref={ref => {
                                if (ref && !gameView) {
                                    setGameView(createGameView(ref));
                                }
                            }}
                            className="object-cover h-full w-full"
                            style={{
                                objectPosition: '-300px 0',
                            }}
                        />

                        <div className="absolute bottom-0 inset-x-0 flex justify-between px-6 pb-3">
                            <div
                                className="bg-center bg-cover w-16 aspect-square rounded-xl cursor-pointer"
                                style={{ backgroundImage: `url(${(photos[0] && photos[0].image) || null})` }}
                                onClick={() => navigate('/photo')}
                            />
                            <div
                                className="bg-white h-16 w-16 rounded-full ring ring-white ring-offset-2 ring-offset-black cursor-pointer"
                                onClick={handleTakePhoto}
                            />
                            <RefreshIcon
                                className="bg-[#1D1D1D] bg-opacity-70 text-white p-2 h-12 w-12 rounded-full cursor-pointer"
                                onClick={toggleCameraPhotoMode}
                            />
                        </div>
                    </AppContent>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};

export default CameraApp;
