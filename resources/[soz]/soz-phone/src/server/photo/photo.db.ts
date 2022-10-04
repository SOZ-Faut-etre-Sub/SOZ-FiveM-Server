import { GalleryPhoto } from '../../../typings/photo';

export class _PhotoDB {
    async uploadPhoto(identifier: string, image: string): Promise<GalleryPhoto> {
        const id = await exports.oxmysql.insert_async('INSERT INTO phone_gallery (identifier, image) VALUES (?, ?)', [
            identifier,
            image,
        ]);
        return { id, image };
    }

    async getPhotosByIdentifier(identifier: string): Promise<GalleryPhoto[]> {
        return await exports.oxmysql.query_async(
            'SELECT id, image FROM phone_gallery WHERE identifier = ? ORDER BY id DESC',
            [identifier]
        );
    }

    async deletePhoto(photo: GalleryPhoto, identifier: string) {
        await exports.oxmysql.query_async('DELETE FROM phone_gallery WHERE image = ? AND identifier = ?', [
            photo.image,
            identifier,
        ]);
    }
}

const PhotoDB = new _PhotoDB();

export default PhotoDB;
