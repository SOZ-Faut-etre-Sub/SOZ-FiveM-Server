import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {addQueryToLocation} from '@common/utils/addQueryToLocation';
import {getLocationFromUrl} from '@common/utils/getLocationFromUrl';
import {usePhotosValue} from '../../hooks/state';
import {useTranslation} from 'react-i18next';
import {AppWrapper} from "@ui/components";
import {AppTitle} from "@ui/components/AppTitle";
import {useApp} from "@os/apps/hooks/useApps";
import {AppContent} from "@ui/components/AppContent";
import {Transition} from '@headlessui/react';
import {ThemeContext} from "../../../../styles/themeProvider";

export const GalleryGrid = () => {
    const photosApp = useApp('PHOTO');
    const history = useHistory();
    const query = useQueryParams();
    const [t] = useTranslation();
    const photos = usePhotosValue();
    const {theme} = useContext(ThemeContext);

    const referal = query.referal ? decodeURIComponent(query.referal) : '/photo/image';

    const handlePhotoOpen = (photo) => {
        history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
    };

    return (
        <AppWrapper>
            <Transition
                appear={true}
                show={true}
                unmount={false}
                className="mt-4 h-full flex flex-col"
                enter="transition-all duration-300"
                enterFrom="translate-x-0"
                enterTo="-translate-x-full"
                leave="transition-all duration-300"
                leaveFrom="-translate-x-full"
                leaveTo="translate-x-0"
            >
                <AppTitle app={photosApp} isBigHeader={true}/>
                <AppContent className="mt-14">
                    {photos.length === 0 && (
                        <div className={`flex flex-col justify-center items-center ${theme === 'dark' ? 'text-white' : 'text-black'} h-[600px]`}>
                            {t('PHOTO.FEEDBACK.NO_PHOTOS')}
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-1">
                        {photos.map((photo) => (
                            <div key={photo.id} className="bg-cover bg-center w-full aspect-square cursor-pointer" style={{backgroundImage: `url(${photo.image})`}}
                                 onClick={() => handlePhotoOpen(photo)}/>
                        ))}
                    </div>
                </AppContent>
            </Transition>
        </AppWrapper>
    );
};
