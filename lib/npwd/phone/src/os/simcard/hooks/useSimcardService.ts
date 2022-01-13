import { useSetRecoilState } from 'recoil';
import { simcardState } from './state';
import { useMyPhoneNumber } from './useMyPhoneNumber';
import InjectDebugData from '../../debug/InjectDebugData';
import { PhoneEvents } from '@typings/phone';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import {SettingsEvents} from "@typings/settings";

InjectDebugData([
  {
    app: 'SIMCARD',
    method: PhoneEvents.SET_NUMBER,
    data: '111-1134',
  },
  {
    app: 'AVATAR',
    method: SettingsEvents.SET_AVATAR,
    data: 'https://beta.iodine.gg/teUcY.jpeg',
  },
]);

export const useSimcardService = () => {
  const setNumber = useSetRecoilState(simcardState.number);
  const setAvatar = useSetRecoilState(simcardState.avatar);
  useNuiEvent('SIMCARD', PhoneEvents.SET_NUMBER, setNumber);
  useNuiEvent('AVATAR', SettingsEvents.SET_AVATAR, setAvatar);
  return useMyPhoneNumber();
};
