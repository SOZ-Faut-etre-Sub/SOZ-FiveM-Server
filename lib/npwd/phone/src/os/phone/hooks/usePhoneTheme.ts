import { useMemo } from 'react';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import themes from '../../../config/themes.json';
import themeOverrides from '../../../styles/themeOverrides';

export const usePhoneTheme = () => {
  const [settings] = useSettings();
  return useMemo(
    () => null,
    [settings.theme],
  );
};
