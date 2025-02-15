import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FixedSizeGrid as Grid } from 'react-window';

import { PhotoItem } from '../../../../../../shared/phone/apps/photos';
import { VirtualizedGridProps } from '../../../../../../shared/virtualized';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useThemeConfig } from '../../../system/config/config.atom';
import { usePhotos } from '../photos.atom';
import { GRID_COLUMN_COUNT, GRID_GAP, GRID_HEIGHT, GRID_WIDTH } from '../photos.constant';

export const GalleryGrid = () => {
    const photosApp = useApp('photos');
    const { t } = useTranslation();

    const theme = useThemeConfig();
    const photos = usePhotos();

    return (
        <AppWrapper>
            <AppTitle app={photosApp} />
            <AppContent>
                {photos.length === 0 && (
                    <div
                        className={clsx('h-full flex flex-col justify-center items-center', {
                            'text-white': theme === 'dark',
                            'text-black': theme === 'light',
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
                    itemData={photos}
                    className={clsx(
                        'scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                        {
                            'scrollbar-thumb-white/80': theme === 'dark',
                            'scrollbar-thumb-black/20': theme === 'light',
                        }
                    )}
                    style={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {ItemRenderer}
                </Grid>
            </AppContent>
        </AppWrapper>
    );
};

const ItemRenderer: FunctionComponent<VirtualizedGridProps<PhotoItem>> = ({ rowIndex, columnIndex, style, data }) => {
    const photo = data[rowIndex * 3 + columnIndex];

    const navigate = useNavigate();
    const query = useQueryParams();

    const referral = query.referral ? decodeURIComponent(query.referral) : '/photos/image';

    const handlePhotoOpen = () => navigate(`${referral}?id=${photo?.id}&image=${photo?.image}`);

    if (!photo) {
        return null;
    }

    return (
        <div style={style}>
            <div
                className="bg-cover bg-center aspect-square cursor-pointer"
                style={{ width: GRID_WIDTH / GRID_COLUMN_COUNT, backgroundImage: `url(${photo.image})` }}
                onClick={handlePhotoOpen}
            />
        </div>
    );
};
