import { ShareIcon, TrashIcon } from '@heroicons/react/solid';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PhotoItem } from '../../../../../../shared/phone/apps/photos';
import { useClipboard } from '../../../../../hook/clipboard';
import { PictureModal } from '../../../components/PictureModal';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useAlert } from '../../../system/alerts/hooks/useAlert';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

export const GalleryModal = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [bigImage, setBigImage] = useState<boolean>(false);

    const query = useQueryParams();

    const { sendAlert } = useAlert();
    const { sendIsland } = useDynamicIsland();
    const { addNotification } = useNotifications();
    const copyToClipboard = useClipboard();

    const referral = query.referral || '/photos';

    const meta: PhotoItem = useMemo(() => ({ id: parseInt(query.id), image: query.image as string }), [query]);

    const handleDeletePhoto = () => {
        sendAlert('Supprimer la photo ?', 'Cette action est irréversible.', () => {
            fetchNui(NuiEvent.PhoneAppPhotosDelete, meta.id)
                .catch(() => {
                    addNotification({ app: 'photos', title: t('CAMERA.FAILED_TO_DELETE') });
                })
                .finally(() => {
                    navigate(-1);
                });
        });
    };

    const handleCopyImage = () => {
        copyToClipboard(meta.image);
        sendIsland('success');
        navigate(referral);
    };

    useAppTitleGetBackUpdater(() => navigate(referral));

    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <ShareIcon className="size-5 text-black" />,
            onClick: handleCopyImage,
        },
        {
            display: true,
            icon: <TrashIcon className="size-6 text-red-500" />,
            onClick: handleDeletePhoto,
        },
    ]);

    if (!meta) return null;

    return (
        <>
            <PictureModal open={bigImage} setOpen={setBigImage}>
                <img src={meta.image} alt="" />
            </PictureModal>

            <div className="flex flex-col justify-between grow">
                <div
                    onClick={() => setBigImage(true)}
                    className="bg-contain bg-no-repeat bg-center w-full h-full"
                    style={{ backgroundImage: `url(${meta.image})` }}
                />
            </div>
        </>
    );
};
