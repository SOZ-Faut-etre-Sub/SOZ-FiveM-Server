import React, { useEffect, useState } from 'react';
import { useSettings } from '../../apps/settings/hooks/useSettings';
import { useTranslation } from 'react-i18next';


export const PictureReveal: React.FC = ({ children }) => {
  const [settings] = useSettings();
  const [covered, setCovered] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [t] = useTranslation();

  useEffect(() => {
    if (settings.streamerMode === true) {
      setCovered(true);
    }
    setReady(true);
  }, [settings.streamerMode]);

  const onClickCover = () => setCovered(false);

  return (
    <div>
      <div
        onClick={onClickCover}>
        {t('GENERIC_CLICK_TO_REVEAL')}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
