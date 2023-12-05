import { PhoneEvents } from '../../../../typings/phone';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useTimeService = () => {
    useNuiEvent('PHONE', PhoneEvents.SET_TIME, store.dispatch.time.setTime);
};
