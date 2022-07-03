import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { ResourceConfig } from '@typings/config';
import { PhoneEvents } from '@typings/phone';
import { fetchNui } from '@utils/fetchNui';
import { useRecoilValue } from 'recoil';

import { phoneState } from './state';

interface IUsePhone {
    ResourceConfig?: ResourceConfig;
    openPhone(): void;
    closePhone(): void;
    isPhoneOpen: boolean;
}

export const usePhone = (): IUsePhone => {
    const isPhoneOpen = useRecoilValue(phoneState.visibility);
    const config = useRecoilValue(phoneState.resourceConfig);

    const { removeAlerts } = useNotifications();

    const closePhone = () => {
        removeAlerts();
        fetchNui(PhoneEvents.CLOSE_PHONE, undefined, {}).catch();
    };

    const openPhone = () => {
        fetchNui(PhoneEvents.OPEN_PHONE, undefined, {}).catch();
    };

    return {
        ResourceConfig: config as ResourceConfig,
        closePhone,
        openPhone,
        isPhoneOpen,
    };
};
