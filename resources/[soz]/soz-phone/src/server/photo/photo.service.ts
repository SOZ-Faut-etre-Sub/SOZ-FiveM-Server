import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import PhotoDB, { _PhotoDB } from './photo.db';
import { photoLogger } from './photo.utils';

class _PhotoService {
    private readonly photoDB: _PhotoDB;

    constructor() {
        this.photoDB = PhotoDB;
        photoLogger.debug('Photo service started');
    }

    async handleUploadPhoto(reqObj: PromiseRequest<string>, resp: PromiseEventResp<GalleryPhoto>): Promise<void> {
        try {
            if (!reqObj.data) resp({ status: 'error', errorMsg: 'DB_ERROR' });

            const identifier = PlayerService.getIdentifier(reqObj.source);
            const photo = await this.photoDB.uploadPhoto(identifier, reqObj.data);

            emitNet(PhotoEvents.UPLOAD_PHOTO_SUCCESS, reqObj.source, photo);

            resp({ status: 'ok', data: photo });
        } catch (e) {
            photoLogger.error(`Failed to upload photo, ${e.toString()}`, {
                source: reqObj.source,
            });
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleFetchPhotos(reqObj: PromiseRequest<void>, resp: PromiseEventResp<GalleryPhoto[]>) {
        try {
            const identifier = PlayerService.getIdentifier(reqObj.source);
            const photos = await this.photoDB.getPhotosByIdentifier(identifier);

            resp({ status: 'ok', data: photos });
        } catch (e) {
            photoLogger.error(`Failed to fetch photos, ${e.toString()}`, {
                source: reqObj.source,
            });
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleDeletePhoto(reqObj: PromiseRequest<GalleryPhoto>, resp: PromiseEventResp<void>): Promise<void> {
        try {
            const identifier = PlayerService.getIdentifier(reqObj.source);
            await this.photoDB.deletePhoto(reqObj.data, identifier);

            emitNet(PhotoEvents.DELETE_PHOTO_SUCCESS, reqObj.source, reqObj.data);

            resp({ status: 'ok' });
        } catch (e) {
            photoLogger.error(`Failed to delete photo, ${e.toString()}`, {
                source: reqObj.source,
            });
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const PhotoService = new _PhotoService();

export default PhotoService;
