import config from '../../config.json';
import { PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendCameraEvent, sendPhotoEvent } from '../utils/messages';
import { animationService } from './animations/animation.controller';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { ClUtils } from './client';

const exp = global.exports;

let inCameraMode = false;
let disableMouseControl = true;
let frontCam = false;

function CellFrontCamActivate(activate: boolean) {
    return Citizen.invokeNative('0x2491A93618B7D838', activate);
}

RegisterNuiCB<void>(PhotoEvents.ENTER_CAMERA, async (_, cb) => {
    if (!global.isPhoneOpen) {
        await animationService.closeCamera();
        await animationService.closePhone();
        disableMouseControl = false;
        SetNuiFocus(false, false);
        return;
    }

    await animationService.openCamera();
    emit('phone:client:disableControlActions', false);

    inCameraMode = true;

    CreateMobilePhone(1);
    CellCamActivate(true, true);

    emit(PhotoEvents.ENTER_CAMERA);
    if (cb) {
        cb(true);
    }

    while (inCameraMode) {
        await Delay(0);

        if (!disableMouseControl && IsControlJustPressed(0, 176)) {
            disableMouseControl = true;
            SetNuiFocus(true, true);
        }

        if (disableMouseControl) {
            DisableControlAction(0, 1, true); // Look Left/Right
            DisableControlAction(0, 2, true); // Look up/Down
        }
    }
});

RegisterNuiCB<void>(PhotoEvents.TAKE_PHOTO, async (_, cb) => {
    const resp = await handleTakePicture();
    cb(resp);

    disableMouseControl = true;
    SetNuiFocus(true, true);

    emit(`__cfx_nui:${PhotoEvents.ENTER_CAMERA}`);
});

RegisterNuiCB<void>(PhotoEvents.TOGGLE_CAMERA, async (_, cb) => {
    frontCam = !frontCam;
    CellFrontCamActivate(frontCam);

    disableMouseControl = true;
    SetNuiFocus(true, true);
    cb(true);
});

RegisterNuiCB<void>(PhotoEvents.TOGGLE_CONTROL_CAMERA, async (_, cb) => {
    disableMouseControl = !disableMouseControl;
    SetNuiFocus(disableMouseControl, disableMouseControl);
    cb(true);
});

RegisterNuiCB<void>(PhotoEvents.EXIT_CAMERA, async (_, cb) => {
    frontCam = false;
    disableMouseControl = true;
    inCameraMode = false;

    SetNuiFocus(global.isPhoneOpen, global.isPhoneOpen);

    await handleCameraExit();

    emit(PhotoEvents.EXIT_CAMERA);

    emit('phone:client:disableControlActions', global.isPhoneOpen);
    await animationService.closeCamera();
    cb(true);
});

const handleTakePicture = async () => {
    // Wait a frame so we don't draw the display helper text
    ClearHelp(true);
    await Delay(0);
    const resp = await takePhoto();
    emit('phone:client:disableControlActions', true);
    await Delay(200);

    return resp;
};

const handleCameraExit = async () => {
    sendCameraEvent(PhotoEvents.CAMERA_EXITED);
    await animationService.closeCamera();
    emit('phone:client:disableControlActions', true);
    DestroyMobilePhone();
    CellCamActivate(false, false);
};

const takePhoto = () =>
    new Promise((res, rej) => {
        exp['screenshot-basic'].requestScreenshotUpload(
            `${GetConvar('soz_public_api_endpoint', 'https://api.soz.zerator.com')}/graphql`,
            'GQL',
            {
                encoding: config.images.imageEncoding,
                headers: {
                    authorization: `Bearer ${LocalPlayer.state.SozJWTToken}`,
                },
            },
            async (data: any) => {
                try {
                    let parsedData = JSON.parse(data);
                    for (const index of config.images.returnedDataIndexes) parsedData = parsedData[index];
                    const resp = await ClUtils.emitNetPromise(
                        PhotoEvents.UPLOAD_PHOTO,
                        GetConvar('soz_public_endpoint', 'https://soz.zerator.com') + parsedData
                    );
                    res(resp);
                } catch (e) {
                    rej(e.toString());
                }
            }
        );
    });

RegisterNuiProxy(PhotoEvents.FETCH_PHOTOS);
RegisterNuiProxy(PhotoEvents.DELETE_PHOTO);

onNet(PhotoEvents.DELETE_PHOTO_SUCCESS, (result: number) => {
    sendPhotoEvent(PhotoEvents.DELETE_PHOTO_SUCCESS, result);
});

onNet(PhotoEvents.UPLOAD_PHOTO_SUCCESS, (result: number) => {
    sendPhotoEvent(PhotoEvents.UPLOAD_PHOTO_SUCCESS, result);
});
