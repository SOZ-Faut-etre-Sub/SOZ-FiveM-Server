import { SettingsEvents } from '../../typings/settings';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(SettingsEvents.GET_AVATAR);
RegisterNuiProxy(SettingsEvents.UPDATE_PICTURE);
