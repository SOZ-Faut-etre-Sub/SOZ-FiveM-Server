export interface GalleryPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  ENTER_CAMERA = 'phone:camera:enter',
  TAKE_PHOTO = 'phone:camera:take',
  TOGGLE_CAMERA = 'phone:camera:toggle',
  EXIT_CAMERA = 'phone:camera:exit',

  TOGGLE_CONTROL_CAMERA = 'phone:camera:toggleControl',

  CAMERA_EXITED = 'npwd:cameraExited',
  TAKE_PHOTO_SUCCESS = 'npwd:TakePhotoSuccess',
  UPLOAD_PHOTO = 'npwd:UploadPhoto',
  FETCH_PHOTOS = 'npwd:FetchPhotos',
  DELETE_PHOTO = 'npwd:deletePhoto',
}
