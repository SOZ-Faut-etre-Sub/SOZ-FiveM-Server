import { ChevronUpIcon, RefreshIcon } from '@heroicons/react/outline';
import { ColorSwatchIcon, CubeIcon, EmojiHappyIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { fetchNui } from '@public/nui/fetch';
import { createGameView, GameView } from '@public/nui/hook/createGameView';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../shared/event/nui';
import { AppContainer } from '../../components/system/AppContainer';
import { AppContent } from '../../components/system/AppContent';
import { AppWrapper } from '../../components/system/AppWrapper';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { usePhoneVisibility, useSetPhoneFreeCamera } from '../../system/phone.atom';
import { useCall } from '../../system/sim-card/hooks/useCall';
import { useLatestPhotos } from '../photos/photos.atom';
import { usePhoto } from './hooks/usePhoto';

export const CameraApp: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const visible = usePhoneVisibility();
    const setFreeCamera = useSetPhoneFreeCamera();

    const { takePhoto } = usePhoto();
    const { addNotification } = useNotifications();

    const latestPhoto = useLatestPhotos();
    const { currentCall } = useCall();

    const [gameView, setGameView] = useState<GameView>(null);

    const handleGoToGallery = () => navigate('/photos');

    const toggleCameraPhotoMode = async () => fetchNui(NuiEvent.PhoneAppPhotosToggleCamera);

    const handleTakePhoto = async () => {
        if (!gameView) {
            return addNotification({
                app: 'camera',
                title: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
            });
        }

        await takePhoto(gameView);
    };

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

    useEffect(() => {
        if (!visible) {
            return navigate('/', { replace: true });
        }

        fetchNui(NuiEvent.PhoneAppPhotosEnterCamera);

        return () => {
            setFreeCamera(false);
            fetchNui(NuiEvent.PhoneAppPhotosExitCamera);
        };
    }, [visible]);

    useEffect(() => {
        if (!currentCall) return;

        fetchNui(NuiEvent.PhoneAppPhotosExitCamera).then(() => {
            addNotification({
                app: 'camera',
                title: t('CAMERA.IS_NOT_AVAILABLE_DURING_CALL'),
            });
            navigate('/', { replace: true });
        });
    }, [currentCall]);

    return (
        <AppContainer>
            <AppWrapper className="flex flex-col">
                <AppContent className="relative">
                    <div className="absolute top-0 inset-x-0 flex justify-between px-6 pt-3">
                        <div className="flex place-self-start">
                            <EmojiHappyIcon className="size-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                            <LightningBoltIcon className="size-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                        </div>
                        <ChevronUpIcon className="size-7 p-1 bg-white bg-opacity-25 text-white rounded-full" />
                        <div className="flex place-self-end">
                            <CubeIcon className="size-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
                            <ColorSwatchIcon className="size-7 p-1 border border-white border-opacity-25 text-white mx-1 rounded-full" />
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

                    <div className="absolute bottom-0 inset-x-0 flex justify-between items-center px-6 pb-3">
                        <div
                            className="bg-center bg-cover w-16 aspect-square rounded-xl cursor-pointer"
                            style={{ backgroundImage: `url(${(latestPhoto && latestPhoto.image) || null})` }}
                            onClick={handleGoToGallery}
                        />
                        <div
                            className="bg-white size-16 rounded-full ring ring-white ring-offset-2 ring-offset-black cursor-pointer"
                            onClick={handleTakePhoto}
                        />
                        <RefreshIcon
                            className="bg-[#1D1D1D] bg-opacity-70 text-white p-2 size-12 rounded-full cursor-pointer"
                            onClick={toggleCameraPhotoMode}
                        />
                    </div>
                </AppContent>
            </AppWrapper>
        </AppContainer>
    );
};
