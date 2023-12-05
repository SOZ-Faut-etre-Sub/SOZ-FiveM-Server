import { PhoneEvents } from '../../typings/phone';
import { SettingsEvents } from '../../typings/settings';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(SettingsEvents.GET_AVATAR);
RegisterNuiProxy(SettingsEvents.UPDATE_PICTURE);
RegisterNuiProxy(PhoneEvents.SET_CITIZEN_ID);
