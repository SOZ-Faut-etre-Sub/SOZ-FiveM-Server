import React from 'react';
import { CallControls } from './CallControls';

export const CallNotification = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <div>{children}</div>
      <div >
        <CallControls isSmall />
      </div>
    </div>
  );
};
