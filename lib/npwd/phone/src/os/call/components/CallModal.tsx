import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import getBackgroundPath from '../../../apps/settings/utils/getBackgroundPath';
import CallContactContainer from './CallContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const CallModal: React.FC = () => {
  const [settings] = useSettings();
  const { call } = useCall();

  if (!call) return null;

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: `url(${getBackgroundPath(settings.wallpaper.value)})`,
        }}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <div >
            <div>
              <CallContactContainer />
              {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
            </div>
            <CallControls />
          </div>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
