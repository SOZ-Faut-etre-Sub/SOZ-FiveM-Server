import React, {useEffect, useState} from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {useHistory} from 'react-router-dom';
import useInterval from "../hooks/useInterval";
import {Transition} from '@headlessui/react';
import {ChevronUpIcon, RefreshIcon} from "@heroicons/react/outline";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {GalleryPhoto, PhotoEvents} from "@typings/photo";
import {useSnackbar} from "@os/snackbar/hooks/useSnackbar";
import {useTranslation} from "react-i18next";
import {usePhotoActions} from "../../photo/hooks/usePhotoActions";
import {ScreenshotUI} from "../utils/screenshot";
import {usePhotosValue} from "../../photo/hooks/state";
import {ColorSwatchIcon, CubeIcon, EmojiHappyIcon, LightningBoltIcon} from "@heroicons/react/solid";
import {usePhoneVisibility} from "@os/phone/hooks/usePhoneVisibility";

const ui = new ScreenshotUI();
ui.initialize();

const CameraApp: React.FC = () => {
    const history = useHistory();
    const [t] = useTranslation();
    const photos = usePhotosValue();
    const {addAlert} = useSnackbar();
    const { takePhoto } = usePhotoActions();
    const {visibility} = usePhoneVisibility();
    const [image, setImage] = useState('https://placekitten.com/960/540')

    const handleTakePhoto = () => {
        fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.TAKE_PHOTO).then((serverResp) => {
            if (serverResp.status !== 'ok') {
                return addAlert({
                    message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
                    type: 'error',
                });
            }

            takePhoto(serverResp.data);
        });
    };

    const toggleCameraPhotoMode = () => {
        fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CAMERA, {})
    };

    useInterval(() => {
        setImage(ui.generateImage())
    }, 1)

    useEffect(() => {
        if (!visibility) history.push('/');
        fetchNui<ServerPromiseResp<void>>(PhotoEvents.ENTER_CAMERA, {})

        return () => {
            fetchNui<ServerPromiseResp<void>>(PhotoEvents.EXIT_CAMERA, {})
        }
    }, [visibility])

    return (
        <Transition
            appear={true}
            show={true}
            className="h-full flex flex-col"
            enter="transition-all origin-[80%_80%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[80%_80%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppContent className="flex flex-col justify-between h-full">
                    <div className="grid grid-cols-3 place-items-center mx-5 my-2">
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
                    <div className="bg-center bg-cover h-[550px] w-full" style={{backgroundImage: `url(${image})`}}/>
                    <div className="flex justify-between items-center mb-14 mx-4">
                        <div className="bg-center bg-cover w-16 aspect-square rounded-xl cursor-pointer" style={{backgroundImage: `url(${(photos[0] && photos[0].image) || null})`}}
                             onClick={() => history.push('/photo')}/>
                        <div className="bg-white h-16 w-16 rounded-full ring ring-white ring-offset-2 ring-offset-black cursor-pointer" onClick={handleTakePhoto}/>
                        <RefreshIcon className="bg-[#1D1D1D] text-white p-2 h-12 w-12 rounded-full cursor-pointer" onClick={toggleCameraPhotoMode}/>
                    </div>
                </AppContent>
            </AppWrapper>
        </Transition>
    )
};

export default CameraApp;
