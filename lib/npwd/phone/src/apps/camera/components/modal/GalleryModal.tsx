import React, {useMemo, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {ShareModal} from './ShareModal';
import {GalleryPhoto, PhotoEvents} from '@typings/photo';
import {usePhotoActions} from '../../hooks/usePhotoActions';
import {fetchNui} from '@utils/fetchNui';
import {ServerPromiseResp} from '@typings/common';
import {useTranslation} from 'react-i18next';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';

export const GalleryModal = () => {
    const [shareOpen, setShareOpen] = useState(null);

    const history = useHistory();
    const query = useQueryParams();
    const {deletePhoto} = usePhotoActions();
    const {addAlert} = useSnackbar();
    const [t] = useTranslation();

    const referal = query.referal || '/camera';

    const meta: GalleryPhoto = useMemo(
        () => ({id: parseInt(query.id), image: query.image as string}),
        [query],
    );

    const _handleClose = () => {
        history.push(referal);
    };

    const handleDeletePhoto = () => {
        fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.DELETE_PHOTO, {
            image: meta.image,
        }).then((serverResp) => {
            if (serverResp.status !== 'ok') {
                return addAlert({message: t('CAMERA.FAILED_TO_DELETE'), type: 'error'});
            }

            deletePhoto(meta.image);

            history.goBack();
        });
    };

    const handleSharePhoto = useCallback(() => {
        setShareOpen(meta);
    }, [meta]);

    if (!meta) return null;

    return (
        <>
            <ShareModal referal={referal} meta={shareOpen} onClose={() => setShareOpen(null)}/>
            <div >
                {shareOpen && <div />}
                <div>
                    <button
                        color="primary"
                        // startIcon={<ArrowBackIos fontSize="large"/>}
                        onClick={_handleClose}
                    >
                        {t('APPS_CAMERA')}
                    </button>

                    <div  style={{backgroundImage: `url(${meta.image})`}}/>

                    <div >
                        <button color="error" onClick={handleDeletePhoto}>
                            {/*<DeleteIcon fontSize="large"/>*/}
                        </button>
                        <button onClick={handleSharePhoto}>
                            {/*<ShareIcon fontSize="large"/>*/}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
