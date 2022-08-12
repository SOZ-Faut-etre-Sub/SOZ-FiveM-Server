import { useQueryParams } from '@common/hooks/useQueryParams';
import { ShareIcon, TrashIcon } from '@heroicons/react/solid';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { Button } from '@ui/old_components/Button';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';

export const GalleryModal = () => {
    const navigate = useNavigate();
    const query = useQueryParams();
    const config = useConfig();
    const { addAlert } = useSnackbar();
    const [t] = useTranslation();

    const referral = query.referral || '/photo';

    const meta: GalleryPhoto = useMemo(() => ({ id: parseInt(query.id), image: query.image as string }), [query]);

    const handleDeletePhoto = () => {
        fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.DELETE_PHOTO, {
            image: meta.image,
        }).then(serverResp => {
            if (serverResp.status !== 'ok') {
                return addAlert({ message: t('CAMERA.FAILED_TO_DELETE'), type: 'error' });
            }

            navigate(-1);
        });
    };

    const handleCopyImage = () => {
        setClipboard(meta.image);
        addAlert({
            type: 'success',
            message: "Adresse de l'image copiée dans le presse-papier",
        });
        navigate(referral);
    };

    if (!meta) return null;

    return (
        <div className="flex flex-col justify-between h-[790px]">
            <div />
            <div
                className="bg-cover bg-center w-full aspect-square cursor-pointer"
                style={{ backgroundImage: `url(${meta.image})` }}
            />
            <div
                className={cn('grid grid-cols-4 content-start h-16', {
                    'bg-[#1C1C1E] text-white': config.theme.value === 'dark',
                    'bg-ios-50 text-black': config.theme.value === 'light',
                })}
            >
                <Button className={`flex flex-col items-center py-3 text-sm`} onClick={handleCopyImage}>
                    <ShareIcon className="h-6 w-6" />
                </Button>

                <Button
                    className={`flex flex-col items-center col-start-4 py-3 text-sm text-red-500`}
                    onClick={handleDeletePhoto}
                >
                    <TrashIcon className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};
