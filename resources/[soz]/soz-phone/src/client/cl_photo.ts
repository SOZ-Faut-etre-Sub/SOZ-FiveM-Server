import { PhotoEvents } from "../../typings/photo";
import { Delay } from "../utils/fivem";
import { sendCameraEvent, sendPhotoEvent } from "../utils/messages";
import { animationService } from "./animations/animation.controller";
import { RegisterNuiCB, RegisterNuiProxy } from "./cl_utils";
import { ClUtils } from "./client";

let inCameraMode = false;
let disableMouseControl = true;
let frontCam = false;

RegisterNuiCB<void>(PhotoEvents.ENTER_CAMERA, async (_, cb) => {
    if (!global.isPhoneOpen) {
        await animationService.closeCamera();
        await animationService.closePhone();
        disableMouseControl = false;
        SetNuiFocus(false, false);
        return;
    }

    await animationService.openCamera();
    emit("phone:client:disableControlActions", false);

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

    emit("phone:client:disableControlActions", global.isPhoneOpen);
    await animationService.closeCamera();
    cb(true);
});

const handleCameraExit = async () => {
    sendCameraEvent(PhotoEvents.CAMERA_EXITED);
    await animationService.closeCamera();
    emit("phone:client:disableControlActions", true);
    DestroyMobilePhone();
    CellCamActivate(false, false);
};
