import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import { usePhoto } from '../../../hooks/usePhoto';

export const GalleryGrid = () => {
    const photosApp = useApp('photo');
    const [t] = useTranslation();

    const navigate = useNavigate();
    const query = useQueryParams();

    const { getPhotos } = usePhoto();
    const photos = getPhotos();
    const config = useConfig();

    const referral = query.referral ? decodeURIComponent(query.referral) : '/photo/image';

    const handlePhotoOpen = photo => {
        navigate(addQueryToLocation(getLocationFromUrl(referral), 'image', photo.image));
    };

    return (
        <Transition
            show={true}
            enter="transition-all duration-300"
            enterFrom="translate-x-0"
            enterTo="-translate-x-full"
            leave="transition-all duration-300"
            leaveFrom="-translate-x-full"
            leaveTo="translate-x-0"
        >
            <AppTitle app={photosApp} isBigHeader={true} />
            <AppContent className="overflow-y-auto">
                {photos.length === 0 && (
                    <div
                        className={cn('h-full flex flex-col justify-center items-center', {
                            'text-white': config.theme.value === 'dark',
                            'text-black': config.theme.value === 'light',
                        })}
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
    );
};
