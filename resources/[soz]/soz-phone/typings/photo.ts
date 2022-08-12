export interface GalleryPhoto {
    image: string;
    id: number;
}

export enum PhotoEvents {
    ENTER_CAMERA = 'phone:camera:enter',
    TAKE_PHOTO = 'phone:camera:take',
    TOGGLE_CAMERA = 'phone:camera:toggle',
    EXIT_CAMERA = 'phone:camera:exit',
    CAMERA_EXITED = 'phone:cameraExited',

    TOGGLE_CONTROL_CAMERA = 'phone:camera:toggleControl',
    TAKE_PHOTO_SUCCESS = 'phone:TakePhotoSuccess',

    FETCH_PHOTOS = 'phone:photo:fetch',
    UPLOAD_PHOTO = 'phone:photo:upload',
    UPLOAD_PHOTO_SUCCESS = 'phone:photo:upload:success',
    DELETE_PHOTO = 'phone:photo:delete',
    DELETE_PHOTO_SUCCESS = 'phone:photo:delete:success',
}
