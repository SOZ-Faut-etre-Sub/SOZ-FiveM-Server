import { useMemo } from 'react';

import { useSettings } from '../../../apps/settings/hooks/useSettings';

export const usePhoneTheme = () => {
    const [settings] = useSettings();
    return useMemo(() => null, [settings.theme]);
};
