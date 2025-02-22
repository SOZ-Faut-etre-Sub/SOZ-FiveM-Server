import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { useSetConfig } from '../config.atom';
import { defaultConfig } from '../default.constant';

export const useSettingsChange = () => {
    const { t } = useTranslation();
    const { addNotification } = useNotifications();

    const setConfig = useSetConfig();

    const handleSettingChange = (key: string | number, value: any) => {
        if (key === 'zoom') {
            if (window.innerHeight <= value.value * 10) {
                addNotification({
                    app: 'settings',
                    title: t('SETTINGS.ZOOM.WARNING'),
                });
                return;
            }
        }

        if (key === 'frame') {
            fetchNui(NuiEvent.PhoneSetPropModel, { frame: value.value });
        }

        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setConfig(defaultConfig);
        addNotification({
            app: 'settings',
            title: 'success',
            content: t('SETTINGS.MESSAGES.SETTINGS_RESET'),
        });
    };

    return { handleSettingChange, resetSettings };
};
