import { ActiveCall } from '@typings/call';
import { atom, useRecoilState } from 'recoil';

export const callerState = {
    currentCall: atom<ActiveCall | null>({
        key: 'currentCall',
        default: null,
    }),
    callModal: atom<boolean>({
        key: 'callingModal',
        default: false,
    }),
    callDuration: atom({
        key: 'callDuration',
        default: { ms: 0, s: 0, m: 0, h: 0 },
    }),
};

export const useCurrentCall = () => useRecoilState(callerState.currentCall);
