import { PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendCameraEvent, sendMessage } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { ClUtils, config } from './client';
import { animationService } from './animations/animation.controller';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none');
const exp = global.exports;

let inCameraMode = false;
let disableMouseControl = true;
let frontCam = false;

function CellFrontCamActivate(activate: boolean) {
  return Citizen.invokeNative('0x2491A93618B7D838', activate);
}

RegisterNuiCB<void>(PhotoEvents.ENTER_CAMERA, async (_, cb) => {
    await animationService.openCamera();
    emit('npwd:disableControlActions', false);

    inCameraMode = true

    CreateMobilePhone(1);
    CellCamActivate(true, true);

    emit(PhotoEvents.ENTER_CAMERA);

    while (inCameraMode) {
        await Delay(0);

        if (!disableMouseControl && IsControlJustPressed(0, 176)) {
            disableMouseControl = true
            SetNuiFocus(true, true)
        }

        if (disableMouseControl) {
            DisableControlAction(0, 1, true) // Look Left/Right
            DisableControlAction(0, 2, true) // Look up/Down
        }
    }

});

RegisterNuiCB<void>(PhotoEvents.TAKE_PHOTO, async (_, cb) => {
    if (SCREENSHOT_BASIC_TOKEN !== 'none') {
        const resp = await handleTakePicture();
        cb(resp);
    }
    console.error(
        'You may be trying to take a photo, but your token is not setup for upload! See NPWD Docs for more info!',
    );

    disableMouseControl = true
    SetNuiFocus(true, true)
});

RegisterNuiCB<void>(PhotoEvents.TOGGLE_CAMERA, async (_, cb) => {
    frontCam = !frontCam;
    CellFrontCamActivate(frontCam);

    disableMouseControl = true
    SetNuiFocus(true, true)
});

RegisterNuiCB<void>(PhotoEvents.TOGGLE_CONTROL_CAMERA, async (_, cb) => {
    disableMouseControl = !disableMouseControl
    SetNuiFocus(disableMouseControl, disableMouseControl)
});


RegisterNuiCB<void>(PhotoEvents.EXIT_CAMERA, async (_, cb) => {
    frontCam = false
    disableMouseControl = true;
    inCameraMode = false;

    SetNuiFocus(true, true)

    await handleCameraExit();

    emit(PhotoEvents.EXIT_CAMERA);

    emit('npwd:disableControlActions', true);
    await animationService.closeCamera();
});

const handleTakePicture = async () => {
  // Wait a frame so we don't draw the display helper text
  ClearHelp(true);
  await Delay(0);
  const resp = await takePhoto();
  DestroyMobilePhone();
  CellCamActivate(false, false);
  animationService.openPhone();
  emit('npwd:disableControlActions', true);
  await Delay(200);

  return resp;
};

const handleCameraExit = async () => {
  sendCameraEvent(PhotoEvents.CAMERA_EXITED);
  await animationService.closeCamera();
  emit('npwd:disableControlActions', true);
  DestroyMobilePhone();
  CellCamActivate(false, false);
};

const takePhoto = () =>
  new Promise((res, rej) => {
    // Return and log error if screenshot basic token not found
    if (SCREENSHOT_BASIC_TOKEN === 'none' && config.images.useAuthorization) {
      return console.error('Screenshot basic token not found. Please set in server.cfg');
    }
    exp['screenshot-basic'].requestScreenshotUpload(
      config.images.url,
      config.images.type,
      {
        encoding: config.images.imageEncoding,
        headers: {
          authorization: config.images.useAuthorization
            ? `${config.images.authorizationPrefix} ${SCREENSHOT_BASIC_TOKEN}`
            : undefined,
          'content-type': config.images.contentType,
        },
      },
      async (data: any) => {
        try {
          let parsedData = JSON.parse(data);
          for (const index of config.images.returnedDataIndexes) parsedData = parsedData[index];
          const resp = await ClUtils.emitNetPromise(PhotoEvents.UPLOAD_PHOTO, parsedData);
          res(resp);
        } catch (e) {
          rej(e.message);
        }
      },
    );
  });

RegisterNuiProxy(PhotoEvents.FETCH_PHOTOS);
RegisterNuiProxy(PhotoEvents.DELETE_PHOTO);
