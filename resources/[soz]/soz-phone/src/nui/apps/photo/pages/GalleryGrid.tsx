import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { Transition } from '@headlessui/react';
import { useApp } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import cn from 'classnames';
import React, { CSSProperties, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FixedSizeGrid as Grid } from 'react-window';

import { GalleryPhoto } from '../../../../../typings/photo';
import { useConfig } from '../../../hooks/usePhone';
import { usePhoto } from '../../../hooks/usePhoto';

const GRID_COLUMN_COUNT = 3;
const GRID_WIDTH = 380;
const GRID_HEIGHT = 700;
const GRID_GAP = 2;

export const GalleryGrid = () => {
    const photosApp = useApp('photo');
    const [t] = useTranslation();

    const { getPhotos } = usePhoto();
    const photos = getPhotos();
    const config = useConfig();

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
            <AppContent scrollable={false}>
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

                <Grid
                    height={GRID_HEIGHT}
                    width={GRID_WIDTH}
                    columnWidth={GRID_WIDTH / GRID_COLUMN_COUNT + GRID_GAP}
                    rowHeight={GRID_WIDTH / GRID_COLUMN_COUNT + GRID_GAP}
                    rowCount={Math.ceil(photos.length / GRID_COLUMN_COUNT)}
                    columnCount={GRID_COLUMN_COUNT}
                    itemData={{ photos }}
                    style={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {ItemRenderer}
                </Grid>
            </AppContent>
        </Transition>
    );
};

type ItemRendererProps = {
    data: { photos: GalleryPhoto[] };
    rowIndex: number;
    columnIndex: number;
    style: CSSProperties;
};

const ItemRenderer: FunctionComponent<ItemRendererProps> = ({ data, rowIndex, columnIndex, style }) => {
    const photo = data.photos[rowIndex * 3 + columnIndex];

    const navigate = useNavigate();
    const query = useQueryParams();

    const referral = query.referral ? decodeURIComponent(query.referral) : '/photo/image';

    const handlePhotoOpen = photo => {
        navigate(addQueryToLocation(getLocationFromUrl(referral), 'image', photo.image));
    };

    if (!photo) {
        return null;
    }

    return (
        <div style={style}>
            <div
                className="bg-cover bg-center aspect-square cursor-pointer"
                style={{ width: GRID_WIDTH / GRID_COLUMN_COUNT, backgroundImage: `url(${photo.image})` }}
                onClick={() => handlePhotoOpen(photo)}
            />
        </div>
    );
};
