import React from 'react';
import {useHistory} from 'react-router-dom';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {addQueryToLocation} from '@common/utils/addQueryToLocation';
import {getLocationFromUrl} from '@common/utils/getLocationFromUrl';
import {fetchNui} from '@utils/fetchNui';
import {ServerPromiseResp} from '@typings/common';
import {GalleryPhoto, PhotoEvents} from '@typings/photo';
import {usePhotoActions} from '../../hooks/usePhotoActions';
import {usePhotosValue} from '../../hooks/state';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {useTranslation} from 'react-i18next';
import {AppWrapper} from "@ui/components";
import {AppTitle} from "@ui/components/AppTitle";
import {useApp} from "@os/apps/hooks/useApps";
import {AppContent} from "@ui/components/AppContent";
import { Transition } from '@headlessui/react';

export const GalleryGrid = () => {
    const photosApp = useApp('CAMERA');
    const history = useHistory();
    const query = useQueryParams();
    const {addAlert} = useSnackbar();
    const [t] = useTranslation();
    const photos = usePhotosValue();
    const {takePhoto} = usePhotoActions();

    const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

    const handlePhotoOpen = (photo) => {
        history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
    };

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

    if (!photos)
        return (
            <div>
                <div>
                    <button onClick={takePhoto} style={{borderRadius: 0}}>
                        {/*<AddIcon fontSize="large"/>*/}
                    </button>
                </div>
            </div>
        );

    return (
        <AppWrapper>
            <Transition
                appear={true}
                show={true}
                className="mt-4 h-full flex flex-col"
                enter="transition-all duration-300"
                enterFrom="translate-x-0"
                enterTo="-translate-x-full"
                leave="transition-all duration-300"
                leaveFrom="-translate-x-full"
                leaveTo="translate-x-0"
            >
                <AppTitle app={photosApp} isBigHeader={true}/>
                <div  style={{cursor: 'pointer'}}>
                    {/*<AddBox color="primary" onClick={handleTakePhoto}/>*/}
                </div>
                <AppContent>
                    <div className="grid grid-cols-3 gap-1">
                        {photos.map((photo) => (
                            <div key={photo.id}  className="bg-cover bg-center w-full aspect-square" style={{backgroundImage: `url(${photo.image})`}} onClick={() => handlePhotoOpen(photo)} />
                        ))}
                    </div>
                </AppContent>
            </Transition>
        </AppWrapper>
    );
};
