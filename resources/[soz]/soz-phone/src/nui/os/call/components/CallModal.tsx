import { AppWrapper } from '@ui/old_components';
import { AppContent } from '@ui/old_components/AppContent';
import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';

import { useCall } from '../hooks/useCall';
import CallContactContainer from './CallContactContainer';
import { CallControls } from './CallControls';
import { CallTimer } from './CallTimer';
import RingingText from './RingingText';

export const CallModal: React.FC = () => {
    const { call } = useCall();

    if (!call) return null;

    return (
        <AppWrapper className="bg-black bg-opacity-30 backdrop-blur">
            <AppContent className="z-40 h-full">
                <React.Suspense fallback={<LoadingSpinner />}>
                    <CallContactContainer />
                    {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
                    <CallControls />
                </React.Suspense>
            </AppContent>
        </AppWrapper>
    );
};
