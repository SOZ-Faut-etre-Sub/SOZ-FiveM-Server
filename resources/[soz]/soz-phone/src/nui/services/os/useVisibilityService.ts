import { PhoneEvents } from '../../../../typings/phone';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useVisibilityService = () => {
    useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, store.dispatch.visibility.setVisibility);
};
