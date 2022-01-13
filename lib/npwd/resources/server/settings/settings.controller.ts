import {PreDBSettings, SettingsEvents} from "../../../typings/settings";
import SettingsService from "./settings.service";
import {settingsLogger} from "./settings.utils";
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<PreDBSettings, number>(SettingsEvents.UPDATE_PICTURE, (reqObj, resp) => {
  SettingsService.handleUpdateProfilePicture(reqObj, resp).catch((e) => {
    settingsLogger.error(
      `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<void, string>(SettingsEvents.SET_AVATAR, (reqObj, resp) => {
  SettingsService.getProfilePicture(reqObj, resp).catch((e) => {
    settingsLogger.error(
      `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
