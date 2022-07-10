import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { AppTitle } from '@ui/old_components/AppTitle';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from '../../../../styles/themeProvider';
import { usePhotosValue } from '../../hooks/state';

export const GalleryGrid = () => {
    const photosApp = useApp('photo');
    const navigate = useNavigate();
    const query = useQueryParams();
    const [t] = useTranslation();
    const photos = usePhotosValue();
    const { theme } = useContext(ThemeContext);

    const referal = query.referal ? decodeURIComponent(query.referal) : '/photo/image';

    const handlePhotoOpen = photo => {
        navigate(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
    };

    return (
        <AppWrapper>
            <Transition
                show={true}
                className="mt-4 h-full flex flex-col"
                enter="transition-all duration-300"
                enterFrom="translate-x-0"
                enterTo="-translate-x-full"
                leave="transition-all duration-300"
                leaveFrom="-translate-x-full"
                leaveTo="translate-x-0"
            >
                <AppTitle app={photosApp} isBigHeader={true} />
                <AppContent className="mt-14 h-[40%] overflow-y-auto">
                    {photos.length === 0 && (
                        <div
                            className={`flex flex-col justify-center items-center ${
                                theme === 'dark' ? 'text-white' : 'text-black'
                            } h-[600px]`}
                        >
                            {t('PHOTO.FEEDBACK.NO_PHOTOS')}
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-1">
                        {photos.map(photo => (
                            <div
                                key={photo.id}
                                className="bg-cover bg-center w-full aspect-square cursor-pointer"
                                style={{ backgroundImage: `url(${photo.image})` }}
                                onClick={() => handlePhotoOpen(photo)}
                            />
                        ))}
                    </div>
                </AppContent>
            </Transition>
        </AppWrapper>
    );
};
